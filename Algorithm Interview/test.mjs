class PrefixNode {
  constructor() {
    this.children = {}
    this.endWord = false
  }

  add(word) {
    if (word === "") {
      this.endWord = true;
      return;
    }
    let c = word[0], rest = word.substring(1)
    this.children[c] ||= new PrefixNode()
    this.children[c].add(rest)
  }
}