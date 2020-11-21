const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Atour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters']
  },
  rating: {
    type: Number,
    default: 4.5
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Atour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        //this only point to curent doc
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below price'
    }
  },
  summary: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDate: [Date],
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
});
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});
////mongoose pre hook document middleware that runs before .save() .create()
// tourSchema.pre('save', function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });
// //mongoose post hook middleware runs after save() & create()
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

////Query middleware
// tourSchema.pre(/^find/, function(next) {
//   //remove secret tours from query result
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(docs);
//   next();
// });
////Aggregation middleware
// tourSchema.pre('aggregate', function(next) {
//   //add match pipeline at the beg
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
