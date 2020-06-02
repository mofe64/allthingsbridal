const mongose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title required'],
    },
    slug: {
      type: String,
    },
    introText: {
      type: String,
      required: [true, 'Kindly provide a short intro text'],
    },
    post: {
      type: String,
      required: [true, 'Post cannot be empty'],
    },
    featured: {
      type: Boolean,
      default: true,
    },
    coverImage: {
      type: String,
      required: [true, 'Please provide link to cover image'],
    },
  },
  { timestamps: true }
);

postSchema.pre('save', function (next) {
  this.slug = slugify(`${this.title}`, { lower: true });
  next();
});

const Post = mongose.model('Post', postSchema);

module.exports = Post;
