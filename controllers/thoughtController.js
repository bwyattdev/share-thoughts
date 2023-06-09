const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  getOneThought(req, res) {
    Thought.findById(req.params.id)
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: _id }}, { new: true, runValidators: true });
      })
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found!' })
          : res.json({ thought })
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteThought(req, res) {
    Thought.deleteOne({ _id: req.params.id })
      .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought found!' })
        : User.findByIdAndUpdate(req.params.userId,  {$pull: { thoughts: req.params.id }}, { runValidators: true, new: true})
      )
      .then(() => res.json({ message: 'Thought successfully deleted.'}))
      .catch((err) => res.status(500).json(err));
  },
  addReaction(req, res) {
    Thought.findByIdAndUpdate(req.params.id, {$addToSet: { reactions: req.body }}, { runValidators: true, new: true })
    .then((reaction) =>
      !reaction
        ? res.status(404).json({ message: 'No thought found with that ID' })
        : res.json({ reaction })
    )
    .catch((err) => res.status(500).json(err));
  },
  deleteReaction(req, res) {
    Thought.findByIdAndUpdate(req.params.id, {$pull: { reactions: { reactionId: req.params.reactionId} }}, { runValidators: true, new: true })
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: 'No reaction found with that ID' })
          : res.json({ message: `Reaction ${req.params.reactionId} successfully deleted.` })
      )
      .catch((err) => res.status(500).json(err));
  }
}