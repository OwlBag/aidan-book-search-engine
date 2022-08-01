const { User, Book } = require('../models');

const { AuthenticationError } = require('apollo-server-express');

const { signToken } = require('../utils/auth');

const resolvers ={
    Query: {
        me: async (parent, args) => {
            const foundUser = await User.findOne({
                $or: [{ _id: args.id }, { username: args.username }],
              });

            return foundUser
        }
    },
    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user }
        },
        saveBook: async (parent, args) => {

        }
    }
}

module.exports = resolvers;