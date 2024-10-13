# Basics
```javascript
let a = [1, 2, 3]

// from i to j not including j itself. meaining a.slice(i, i) will be []
a.slice(i, j)

// get 2 elements starting from i, if not enough elements, get all of them up to the end.
// meaning the second element can go out of range.
a.slice(i, i + 2)

// from i to end
a.slice(i)
a.slice(i, a.length)

// from i to end, except the last n elements
a.slice(i, a.length - n)

// n last elements
a.slice(-n)

// this is allowed and will return []
a.slice(100000)


// Injection:
a.splice(i, delete_count, array_to_inject)

// asc sort
objects.sort((a, b) => a - b)

// divisions geneerate floats. use Math.floor or Math.ceil for rounding
5 / 2    // = 2.5


// Class notation
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}
```

# Binary search
```javascript
const bsearch = (arr, target) => {
  let i = 0, j = arr.length - 1;

  while (i <= j) {
    let mid = Math.floor((i + j) / 2)
    const val = arr[mid]
    if (target === val) {
      return [true, mid]
    } else if (target > val) {
      i = mid + 1
    } else {
      j = mid - 1
    }
  }

  return [false, i]
}
```

# Merging two sorted arrays
```javascript
const merge = (nums1, nums2) => {
  let i = 0, j = 0;
  const col = []
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] < nums2[j]) {
      col.push(nums1[i])
      i += 1
    } else {
      col.push(nums2[j])
      j += 1
    }
  }

  return [...col, ...nums1.slice(i), ...nums2.slice(j)]
}
```


# Prefix Tree (Trie)
This tree is used for storing a set of strings:
```
        root
         |
        'c'
         |
        'a'
       / | \
     't' 'p' 'r'
   (end) (end) (end)
```
- Each node of this tree represents a suffix and stores a map with keys being possible characters after this prefix and value of each key pointing to the child node for resulting prefix.
- Each node could also have a boolean, denoting the end of a valid word.
- This tree can be used to:
  - Find out if a string is in a set?
  - If any of prefixes of a string is in a set?
  - Suggest autocomplete words existing in the set

```javascript
class PrefixNode {
  constructor() {
    // keys are characters, value is a another PrefixNode
    this.children = {}
    this.is_leaf = false
  }

  add(word) {
    if (word.length === 0) {
      this.is_leaf = true
      return
    }
    let first_char = word[0], rest = word.slice(1)
    this.children[first_char] ||= new PrefixNode()
    this.children[first_char].add(rest)
  }
}
```



- Find closest less and greater elements on left and right of each element

prev_less = Array.new(nums.length, -1)
min_stack = []
for i in 0..nums.length - 1
  while min_stack.length > 0 && nums[min_stack.last] >= nums[i]
      min_stack.pop()
  end
  prev_less[i] = min_stack.last || -1
  min_stack << i
end

next_less = Array.new(nums.length, nums.length)
min_stack = []
for i in 0..(nums.length - 1)
    while min_stack.length > 0 && nums[min_stack.last] > nums[i]
        next_less[min_stack.pop] = i
    end
    min_stack << i
end

max_stack = []
prev_greater = Array.new(nums.length, -1)
for i in 0..(nums.length - 1)
    while max_stack.length > 0 && nums[max_stack.last] <= nums[i]
        max_stack.pop
    end
    prev_greater[i] = max_stack.last || -1
    max_stack << i
end

max_stack = []
next_greater = Array.new(nums.length, nums.length)
for i in 0..(nums.length - 1)
    while max_stack.length > 0 && nums[max_stack.last] < nums[i]
        next_greater[max_stack.pop] = i
    end
    max_stack << i
end


asc_min_stack and desc_max_stack is the solution for fiding min o max for subarrays of array
when the problem is about substrings of string or subarrays of array, the optimum solution will be like:
  for each index i, it may contribute to the final answer in x substrings:
    the closest index at the left that the substring can start from where index i can contribute to final answer: j
    the closes index at the right that the substring can end at where index i can contribute to the final answer: k
    (k - i) * (i - j)

DP:
    think about if you can solve f(n) having all f(k) where k < n


Differnet DFS traverse:
Inorder: L Root R
  inorder of bst will return a sorted array
Preorder: Root L R
  copying tree or make a prefix notation of a math expression
Postorder: L R Root
  Deleting tree of make a postfix notation of a math expression

  Math expression notations:
Prefix notation: + 4 5 (doesnt need paranthesis as long as operators take fixed num of operands)
Infix  notation: 4 + 5 (requires parathensis)
Postfix notation: 4 5 + (doesnt need paranthesis as long as operators take fixed num of operands)


class Point
  attr_accessor :x, :y
  def initialize(x, y)
    @x = x
    @y = y
  end
end


- find number of islands in 2d array or 1 and 0: DFS and set 0 when visit
- given a word and a list of dict words, find out if you can construct the word using dict words
  sol 1: dp: f(i) = find if sub(x, i) is in dict word where x < i and f(x) = true
  sol 2: dfs: use a stack to store unmatched reminder of strings. pop and find if there is a dict word it starts with. put reminder in stack.
- given a word and a list of dict words, find out all different combination of dict words which construct the word
  this is dp:
  catsanddog, cat, cats, dog, and, sand
  dp[0] = []
  dp[1] = []
  dp[2] = ["cat"]
  dp[3] = ["cats"]
  dp[4] = []
  dp[5] = []
  dp[6] = ["cat sand", "cats and"]
- merging intervals: put all starts and ends (with marks 's', 'e') in a array, sort them, then use that array to solve the problem
- longest sub-array with positive product. split the original by 0, because 0 messes it up
  dp[i] =
    if negs_so_far is even
      i + 1
    else
      max[dp[i - 1], substring(firstneg..i).length]
    end
- min swap to group all ones together: a group of 1 with length n, use sliging window find the window with most ones.
 this will be the window you will need least swaps. answer is num of 0s in this window.
- BFS is a shortest path algorithm.
- BFS and DFS usually is written as you put the root of search in stack (DFS) or Queue(BFS), then you pop it and put its children
- find shortest transformation sequence. use BFS
- Trie Tree is very good to find if a string or any of its prefixes is in a set or not? it can help telling you stop the search because this string is not a prefix of any word.
- Trapped water problem: for every index: trapped water = lesser of maxes on left and right - height of this index
- Finding words in n*m grid of chars: DFS
- You can use a sorted array and bsearch for min and max heap (or priority queue)
- find max in sliding window: use double ended queue. always keep it DESC (pop from right if you have to). push to right of it. pop from left to throw away any index out of this sliding window.
- Topological sort:
  DFS because you need to find the deepest dependency. the leaves of tree.
  Use a stack. for each node: run dfs. when visiting nodes mark them Temporarily and go deep.
  when you get to a dead end of no more ways to go, put in stack and mark permanently.
  if you find a permanent mark during dfs its fine. if you find a temp mark its a cycle. dependancy loop
- Priority Queue is good for when you want to pop a max and still have another max ready to pop or min (specially for problems where max and min of subarrays is concerned)
- for problems where you want to find max (or min) in sliding windows, since the window is sliding, as soon as you find a greater value on the right, you wont need values less than
that on the left because for this and every future window, these values wont become max. so you can use double ended queue. when you slide the window you should pop elements
from the left and push element to the right maintaining the DESC order. so pop from right until you dont have any values less than this. then put it on the right.
- for problems about max and mins of subarrays, using min and max stack can help finding next_less prev_next index for each index and find longest sub-array (or all the subarrays) where each element is minimum in.
similarly you can use prev_greater and next_greater to find out subarrays where that element is maximum in. This particularly helpful in problems whose answers are dependent to all the subarrays in which element x is max or min in.
- Array problems which for each i asks for operations on all elements execpt i prefix and suffix operations may be helpful

Good Problems
https://leetcode.com/problems/sum-of-subarray-ranges/
    prev_less next_less prev_greater and next_greater
https://leetcode.com/problems/concatenated-words/
    DP
https://leetcode.com/problems/maximum-length-of-subarray-with-positive-product/
    DP
https://leetcode.com/problems/range-addition/
    Another version of merging intervals
https://leetcode.com/problems/sliding-window-maximum/
    Use a double ended queue and keep it monotonously decreasing. so when you see a big number at the current index, there is no chance
    that smaller numbers before this can ever be max. so pop right of the queue until you get an element that is bigger.
https://leetcode.com/problems/sell-diminishing-valued-colored-balls
    5 3 3 3 1 1 = 1(5 + 4) + 4(3 + 2) + 6 (1 + 0)
    7 7 4 2 1 = 2(7 + 6 + 5) + 3(4 + 3) + 4(2) + 5(1)
https://leetcode.com/problems/word-break/
    BFS or DP
https://leetcode.com/problems/course-schedule-ii
    Topological sort. DFS
https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/
    Use two Deques: max_deque and min_deque. keep 2 pointers i j. move j right, and update deques. then if max - min is bigger than limit move i right until it fixes
    now check if j - i is max
https://leetcode.com/problems/median-of-two-sorted-arrays
    LEARN THIS **************
https://leetcode.com/problems/gas-station/
    diffs and suffix sum
https://leetcode.com/problems/design-an-expression-tree-with-evaluate-function/
    having postfix, start from the end. if you see operator, push to stack, if you see number,
    attach it as the missing child of operator at top of stack. if the operator has both its
    left and right children, continue attaching this to the next element in stack.
https://leetcode.com/problems/build-binary-expression-tree-from-infix-expression
    having the expression string, start from beginning. if you see number push it to stack. if you see
    + or - you must try to attach all nodes in stack (or up until '(') so far as its left child.
    if you see * or / you must attach the top of stack as left child. if you see open paranthesis push it to stack
    and when you see close paranthesis, build entire sub tree in stack up until open par, pop open par and push the sbtree to stack.
    at the end built the entire tree attaching subtrees in stack to right of prev element in stack.
https://leetcode.com/problems/symmetric-tree
      LRO(root.left) == RLO(root.right)
https://leetcode.com/problems/binary-tree-maximum-path-sum/
  for each node (starting from root): the answer is max of below:
    left_to_leaves_max + right_to_leaves_max + node.val
    left_to_leaves_max + node
    right_to_leaves_max + node
    node
    max_path_sum(left child)
    max_path_sum(right child)
https://leetcode.com/problems/diameter-of-binary-tree
  for each node(starting from root) the answer is max of below
    max_height_left + max_height_right + 2
    diameter(left_child)
    diameter(right_child)
https://leetcode.com/problems/word-ladder/ and https://leetcode.com/problems/word-ladder-ii
  perform bfs search, start from begin_word and try to swap letter with a..z to find one that is in the dict
https://leetcode.com/problems/course-schedule and https://leetcode.com/problems/course-schedule-ii
  Topological sort: dfs and marking temporarily while visiting children or permanently
https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree
  find path from root to p and q, return the last equal node in the prefixes of these paths:
  [1, 2, 3], [1, 2, 5] => 2
https://leetcode.com/problems/longest-substring-without-repeating-characters
  use a map to keep latest index of every char and use 2 pointers
https://leetcode.com/problems/container-with-most-water
  Greedy. sort and keep poping maxes. every time, if the max expands the window, update window start and end index and see if max changes
https://leetcode.com/problems/3sum
  Sort first. for i 0..len start j from i + 1 to forward and k from len - 1 to backwards
https://leetcode.com/problems/minimum-window-substring/
  two pointers. move right until you find all chars you need. use a map to count chars in current window and target string. and keep track of number of characters which you
  have enough counts for. when you see reach the window with all chars counts satisfied save this substring and move left forward untill the window becomes invalid again.
https://leetcode.com/problems/trapping-rain-water/
  prefix max suffix max
