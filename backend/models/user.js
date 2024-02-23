const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /[!@#$%^&*(),.?":{}|<>]/.test(value);
            },
            message: props => `${props.value} must contain at least one special character.`,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user', // 'user' or 'admin'
    },
    reviews: [{
        movieId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 10,
            required: true,
        },
        comment: {
            type: String,
        },
    }],
    usernameChangeCount: {
        type: Number,
        default: 0,
    },
    lastUsernameChange: {
        type: Date,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
