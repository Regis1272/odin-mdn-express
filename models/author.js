const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
});

// Virtual for author's full name:
AuthorSchema.virtual("name").get(function () {
    // To avoid errors in cases where an author does not have either a family name or first name
    // We want to make sure we handle the exception by returning an empty string for that case

    let fullname = "";
    if (this.first_name && this.family_name) {
        fullname = `${this.family_name}, ${this.first_name}`;
    }

    return fullname;
});

// Virtual for author's URL:
//
// ("Declaring our URLs as a virtual in the schema is a good idea because then the URL for an item only ever needs to be changed in one place. At this point, a link using this URL wouldn't work, because we haven't got any routes handling code for individual model instances. We'll set those up in a later article!")
AuthorSchema.virtual("url").get(function () {
    // We DO NOT use an arrow function because we need the 'this' object...
    return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
    return this.date_of_birth
        ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(
              DateTime.DATE_MED,
          )
        : "";
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
    return this.date_of_death
        ? DateTime.fromJSDate(this.date_of_death).toLocaleString(
              DateTime.DATE_MED,
          )
        : "";
});

AuthorSchema.virtual("date_of_birth_YYMMDD").get(function () {
    return this.date_of_birth
        ? DateTime.fromJSDate(this.date_of_birth).toISODate(DateTime.DATE_MED)
        : "";
});

AuthorSchema.virtual("date_of_death_YYMMDD").get(function () {
    return this.date_of_death
        ? DateTime.fromJSDate(this.date_of_death).toISODate(DateTime.DATE_MED)
        : "";
});

AuthorSchema.virtual("lifespan").get(function () {
    const birth = DateTime.fromJSDate(this.date_of_birth).toLocaleString(
        DateTime.DATE_MED,
    );
    const death = DateTime.fromJSDate(this.date_of_death).toLocaleString(
        DateTime.DATE_MED,
    );

    if (!this.date_of_birth) return `Non-existent`;
    return this.date_of_death ? `${birth} - ${death}` : `${birth} - Present`;
});

// Export model.
module.exports = mongoose.model("Author", AuthorSchema);
