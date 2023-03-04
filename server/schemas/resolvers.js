const { User} = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            const foundUser = await User.findOne({ _id: context.user._id });
            if (!foundUser) {
                throw new AuthenticationError('You need to be logged in!');
            }
            return foundUser;
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await user.findOne({ email });
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
            return { token, user };
        },
        saveBook: async (parent, { bookData }, context) => {
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookData } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            } catch (err) {
                console.log(err);
                throw new AuthenticationError('You need to be logged in!');
            }
        },
        removeBook: async (parent, { bookId }, context) => {
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
                return updatedUser;
            } catch (err) {
                console.log(err);
                throw new AuthenticationError('You need to be logged in!');
            }
        }
    }
};

module.exports = resolvers;
