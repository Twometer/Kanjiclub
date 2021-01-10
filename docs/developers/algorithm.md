# Practice Algorithm

### Practice generation

Kanjiclub uses a SRS-like practice algorithm:


Fill the `practice_size` amount of words with
 - all weak words
 - if there is still space, all medium words
 - if there is still space, all strong words.
 - Shuffle

Selecting a new word should be random, but also take into account the last practice date. Words that were recently practiced are 'less weak' than those that have been sitting on the weak list forever. However, we also don't want to bombard the user with the same 5 words they just can't get into their head. This could be implemented by making older words have a higher probability of getting picked in the randomizer.

The same word with the same translation direction should never be selected twice into a practice.

A word should not be selected if it has just been practiced. This overwrites the priority of weak words.

**If the user selects a certain word strength**, create a new practice, consisting of `n = min(num_words, practice_size)` words, randomly picked from the group of words with the selected word strength

### Practice grading
For each word the user practiced, that was correct, move it up one category: 

- weak -> medium
- medium -> strong

For each word the user input wrongly, put it into a lower category:

- Wrong once: Degrade by one
- Wrong twice: Degrade by two