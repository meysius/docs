# Basics
```javascript
let a = [1, 2, 3]

// from i to j not including j itself. meaining a.slice(i, i) will be []
a = a.slice(i, j) concat with  a.slice(j)
// or for strings:
"abcdef".substring(i, j)

// get 2 elements starting from i, if not enough elements, get all of them up to the end.
// the second param can go out of range, it is safe
a.slice(i, i + 2)

// from i to end
a.slice(i)
a.slice(i, a.length)

//  Split n items from the end of a
a.slice(i, a.length - n) ... a.slice(a.length - n)

// this is allowed and will return []
a.slice(100000)


// Injection:
a.splice(i, delete_count, array_to_inject)

// asc sort
objects.sort((a, b) => a - b)

// divisions geneerate floats. use Math.floor or Math.ceil for rounding
5 / 2    // = 2.5

//
objects.reduce(
  (acc, element) => {
    return some acc;
  },
  init_val
)

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

# Finding closest less or greater indexes

- For each element in the array nums, find the index of the closest element on the left (if any) that is less than the current element. If no such element exists, store -1.

```javascript
// For example for nums = [  2,  1,  5,  6,  2,  3]
// We are looking for     [ -1, -1,  1,  2,  1,  4]

function top(stack) {
  return stack[stack.length - 1]
}


function lessLeft(nums) {
  const result = Array(nums.length).fill(-1)
  const stack = []  // this will be ASC stack. => popping every time, you will reach an index with less value below the top of the stack
  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[top(stack)] >= nums[i]) {
      stack.pop()
    }
    result[i] = top(stack) || -1
    stack.push(i)
  }
  return result
}
```

- For each element in the array nums, find the index of the closest element on the right that is less than the current element. If no such element exists, store `nums.length`.

```javascript
// For example for nums = [  2,  1,  5,  6,  2,  3]
// We are looking for     [  1,  6,  4,  4,  6,  6]

function lessRight(nums) {
  const result = Array(nums.length).fill(nums.length)
  const stack = [] // this will be ASC stack. => popping every time, you will reach an index with less value below the top of the stack
  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[top(stack)] > nums[i]) {
      result[stack.pop()] = i
    }
    stack.push(i)
  }
  return result
}
```

- For each element in the array nums, find the index of the closest element on the left (if any) that is greater than the current element. If no such element exists, store -1.

```javascript
// For example for nums = [  2,  1,  5,  6,  2,  3]
// We are looking for     [ -1,  0, -1, -1,  3,  3]

function greaterLeft(nums) {
  const result = Array(nums.length).fill(-1)
  const stack = [] // this will be descending stack. => popping every time, you will reach an index with greater value below the top of the stack
  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[top(stack)] <= nums[i]) {
      stack.pop()
    }
    result[i] = stack.length > 0 ? top(stack) : -1
    stack.push(i)
  }
  return result
}
```

- For each element in the array nums, find the index of the closest element on the right that is greater than the current element. If no such element exists, store `nums.length`.

```javascript
// For example for nums = [  2,  1,  5,  6,  2,  3]
// We are looking for     [  2,  2,  3,  6,  5,  6]

function greaterRight(nums) {
  const result = Array(nums.length).fill(nums.length)
  const stack = [] // this will be descending stack. => popping every time, you will reach an index with greater value below the top of the stack
  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[top(stack)] < nums[i]) {
      result[stack.pop()] = i
    }
    stack.push(i)
  }
  return result
}
```

Array problems which for each i asks for operations on all elements execpt i prefix and suffix operations may be helpful

### Example questions
**Example 1.** Given array nums, find the sum of minimums or maximums of all subarrays of nums.
```
for i in nums:
  sum += (number of subarrays in which nums[i] is min or max in that subarray) * nums[i]

If we find the longest subarray of nums (from j to k) in which nums[i] is min or max:
  j --- i --- k
Then start index could be any index from j to i and end index could be any index from i to k.
Therefore we have this many: (i - j) * (k - i)
```
Ref: https://leetcode.com/problems/sum-of-subarray-minimums/

**Example 2.** Find sum of (max - min) of all subarrays of array nums
```
Sum of all (max - min) = sum of all max - sum of all mins
```
Ref: https://leetcode.com/problems/sum-of-subarray-ranges/

# Dynamic programming
To check if problem p(n) (with input size n) has a DP solution, assume you knew the answer to p(n - 1), p(n - 2), ...
which is the same exact problem expect with one (or more) element dropped from the tail of the input.
This is only adding one more element. can you use all the answers of p(n - 1), p(n - 2), ... to answer p(n)?


**Example 1.** Given an array of integers nums, find the maximum length of a subarray where the product of all its elements is positive.
```
For example:
nums = [1,-2,-3,4]    => return 4
nums = [0,1,-2,-3,-4] => return 3
nums = [-1,-2,-3,0,1] => return 2
```

```
Solution:
The longest subarray with positive product has no zeros in it and the number of negatives are even.
So lets split by 0 first. We will solve the problem for the segments in between and take a max.

Assuming we have no zeros, if the array has even number of negatives, the answer is the length of the array.
That leaves us with only the case where the number of negatives is odd.

Now we think if we can use DP:
Lets say the input is [a, b, c, d, e]
Let assume I know the answer for [a, b, c, d]. If I add e, either:
  - e is not going to be in the longest subarray -> then the longest subarray is same as answer of [a, b, c, d] or p(n - 1)
  - or e will be included in the longest subarray. -> which means the answer is: index_of_first_negative + 1 all the way to the end
  whichever is higher.
```
Ref: https://leetcode.com/problems/maximum-length-of-subarray-with-positive-product

**Example 2.** Given a word and a list of dict words, return true if word can be constructed using words in the dict.
```
s = "leetcode", dict = ["leet","code"] => true
s = "applepenapple", dict = ["apple","pen"] => true (you can reuse the words many times)
s = "catsandog", dict = ["cats","dog","sand","and","cat"] => false
```

```
Solution:
DP check:
Lets say the input is "abcde"
Lets assume I know the answers for all cases where one (or more) element dropped from the tail of the input:
s = "a"     => false
s = "ab"    => false
s = "abc"   => true
s = "abcd"  => false

Now, Can we find the answer for s = "abcde" using all the above answers?
There are two possibilities:
1. "abcde" itself is a dict word
2. "abcde" can be broken into dict words, is if one of the dict words matches a suffix of "abcde".
which means you should find a case where: "abcde" can be broken into two parts: multiple_words_prefix + one_word_suffix.
the multiple_words_prefix part can only be either one of the previous inputs with answer "true". if I can only find one
whose suffix is a one word that exists in the dict then the answer for "abcde" is true.
```
Ref: https://leetcode.com/problems/word-break

**Example 3.**
Given a string s and a dictionary of words, add spaces in s to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.
```
"catsanddog", words = ["cat","cats","and","sand","dog"]
Answer: ["cats and dog","cat sand dog"]
```

```
Solution:

The solution here is exactly like previous problem except, the answer is all possible compositions instead of true/false. so instead of breaking the loop as soon as you find a previous s that satisfies the condition described earlier,
you want to check all of them and return the composition for each.
```

Ref: https://leetcode.com/problems/word-break-ii

**Example 4.** https://leetcode.com/problems/concatenated-words/
```
Solution:

Exactly similar to problem 2, except you sort and start from index 1, and try to use wordDict: 0..i
```

**Example 5.** https://leetcode.com/problems/trapping-rain-water
```
Solution:

If for every index, we find index of max element on left and right, then the trapped water is calculated by summing up trapped water on every index.

For every index:
Trapped water = (Min(max_on_left, max_on_right) - height of this index) if > 0 otherwise 0

So now for heights: [4,2,0,3,2,5] we need to find below:
left_max = [0,0,0,0,0,5]
right_max = [5,5,5,5,5,5]

DP check: If we have answer left_max = [0,0,0,0,0] for [4,2,0,3,2], can we find the left_max for the 5 at the end?
Yes, every time you add an element to input at the end, the left_max of it is either itself or the left_max of its previous element.
right max is also same except you walk from right to left.
```

# Depth First Search
DFS has 3 variations when the tree is Binary search tree:
- **Inorder:** L Root R. Example: Infix notation of math expressions like `4 + 5`
- **Preorder** Root L R. Example: Prefix notation of math expressions like `+ 4 5`
- **Postorder** L R Root. Example: Postfix notation of math expressions like `4 5 +`

DFS is implemnted using stack. First, Root is pushed to the stack. then while the stack is not empty, you keep poping the stack top element and put back its children at the top of the stack. We can also use recursive functions because function calls are also implemented using stacks under the hood.

Which DFS traverse gives you sorted array of number if you have stored the array using BST?
- Inoreder

Which of Infix, postfix, prefix math expression notations require paranthesis?
- Only infix, or if the number of arguments are not fixed all of them need paranthesis.

Which DFS traverse is best for copying trees?
- Preorder because you need to copy root first.

Which DFS traverse is best for deleting BSTs?
- Postorder: because root has to be deleted after left and write childrens

## Topological sort
Topological Sort is an algorithm used to find a linear ordering of the nodes in a directed acyclic graph (DAG).

The intuition behind this algorithm is that the "deepest" nodes (i.e. the leaves of the DAG) will be visited and marked as "Permanently Visited" first, and then added to the stack in reverse order, resulting in a valid topological ordering.

It is particularly useful when working with dependencies: such as software dependencies, scheduling tasks or courses that have dependencies to each other.

### Implementation
First, build the DAG. Dag could be as simple of hash:
```
{
  node i => [j, k , ...] that are dependencies of i
}
```
Also track of visit statuses. It could be a hash of:
```
{
  node i => not yet seen: 0 or opened and currently exploring the subtress of it: 1, or finished exploring all subtrees and closed: 2
}
```
Always prefer function implementation of DFS algorithm. So we have to define a function that takes a node and traverses the graph and returns true if done successfully or false if a cycle is detected. As this function runs, visits hash changes and as soon as nodes are closed they are collected somewhere. This collection will be the topological order. At the beginning of this function, check if node i is already opened, if it is then you have detected a cycle and should return false. also check if you have already explored this node, if so return true before doing anything. Then set node opened, traverse all its childern. if any of the children had a cycle then return false. finally set node closed and collect it and return true.

You have to traverse all nodes. to make sure you collect all the nodes.

Code:
```javascript
// courses = 4, deps = [[1,0],[2,0],[3,1],[3,2]]
// [1, 0] means 1 depends on 0: 1 -> 0
var findTopologicalOrder = function(courses, deps) {
  const dag = deps.reduce(
      (acc, dep) => {
          acc[dep[0]] ||= []
          acc[dep[0]].push(dep[1]);
          return acc;
      },
      {}
  );

  // 0 indicates unvisisted
  // 1 indicates currently open, traversing subtrees is in progress
  // 2 indicates and closed
  const visits = Array(courses).fill(0);

  const result = [];
  // returns true when fully traverse
  function dfs(i) {
    if (visits[i] === 1) return false;
    if (visits[i] === 2) return true;

    visits[i] = 1;
    const children = dag[i] || [];
    for(let k of children) {
      if (dfs(k) === false) { return false }
    }


    result.push(i)
    visits[i] = 2
    return true
  }

  for (let i = 0; i < courses; i++) {
    if (!dfs(i)) {
      return [];
    }
  }

  return result;
};
```


Exmaple Problems:
- https://leetcode.com/problems/course-schedule-ii
- https://leetcode.com/problems/number-of-islands
- https://leetcode.com/problems/word-search


# Breath first search
BFS is implemnted using Queues. First, Root is pushed to the queue. Then you pop the queue head and push its children to the end of the queue.
BFS is the golden standard algorithm for finding shortest paths. For example:
- https://leetcode.com/problems/word-ladder-ii
```
Solution:
perform bfs search, start from begin_word and try to swap letter with a..z to find one that is in the dict
to implement bfs, we create a function that takes a list of objects, each corresponding to a node in current graph level. At the beginning of the function we add termination logic. Then we start processing every node and we replace that node with its children. once all the children of next level are collected, and at the end of the bfs function, we call bfs on the nodes of next level.

```

# Priority queues
- Priority Queue is good for when you want to pop a max and still have another max ready to pop or min (specially for problems where max and min of subarrays is concerned)
- You can use a sorted array and bsearch for min and max heap (or priority queue)

## Good Problems

- https://leetcode.com/problems/sliding-window-maximum
```
Solution:
for problems where you want to find max (or min) in sliding windows, since the window is sliding, as soon as you find a greater value on the right, you wont need values less that on the left because for this and every future window, these values wont become max. so you can use double ended queue. when you slide the window you should pop elements from the left and push element to the right maintaining the DESC order. so pop from right until you dont have any values less than this. then put it on the right.
```
- https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together
```
use sliging window find the window with most ones. this will be the window you will need least swaps. answer is num of 0s in this window.
```

- https://leetcode.com/problems/merge-intervals
```
merging intervals: put all starts and ends (with marks 's', 'e') in a array, sort them, then use that array to solve the problem
```

- https://leetcode.com/problems/range-addition/
```
Another version of merging intervals
```
- https://leetcode.com/problems/sliding-window-maximum/
```
Use a double ended queue and keep it monotonously decreasing. so when you see a big number at the current index, there is no chance that smaller numbers before this can ever be max. so pop right of the queue until you get an element that is bigger.
```
- https://leetcode.com/problems/sell-diminishing-valued-colored-balls
```
5 3 3 3 1 1 = 1(5 + 4) + 4(3 + 2) + 6 (1 + 0)
7 7 4 2 1 = 2(7 + 6 + 5) + 3(4 + 3) + 4(2) + 5(1)
```
- https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/
```
Use two double ended queues: max_deque and min_deque. keep 2 pointers i j. move j right, and update deques. then if max - min is bigger than limit move i right until it fixes
now check if j - i is max
```
- https://leetcode.com/problems/median-of-two-sorted-arrays
- https://leetcode.com/problems/gas-station/
```
diffs and suffix sum
```
- https://leetcode.com/problems/design-an-expression-tree-with-evaluate-function/
```
having postfix, start from the end. if you see operator, push to stack, if you see number,
attach it as the missing child of operator at top of stack. if the operator has both its
left and right children, continue attaching this to the next element in stack.
```
- https://leetcode.com/problems/build-binary-expression-tree-from-infix-expression
```
having the expression string, start from beginning. if you see number push it to stack. if you see
+ or - you must try to attach all nodes in stack (or up until '(') so far as its left child.
if you see * or / you must attach the top of stack as left child. if you see open paranthesis push it to stack
and when you see close paranthesis, build entire sub tree in stack up until open par, pop open par and push the sbtree to stack.
at the end built the entire tree attaching subtrees in stack to right of prev element in stack.
```
- https://leetcode.com/problems/symmetric-tree
```
LRO(root.left) == RLO(root.right)
```
- https://leetcode.com/problems/binary-tree-maximum-path-sum/
```
for each node (starting from root): the answer is max of below:
  left_to_leaves_max + right_to_leaves_max + node.val
  left_to_leaves_max + node
  right_to_leaves_max + node
  node
  max_path_sum(left child)
  max_path_sum(right child)
```
- https://leetcode.com/problems/diameter-of-binary-tree
```
for each node(starting from root) the answer is max of below
  max_height_left + max_height_right + 2
  diameter(left_child)
  diameter(right_child)
```
- https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree
```
find path from root to p and q, return the last equal node in the prefixes of these paths:
[1, 2, 3], [1, 2, 5] => 2
```
- https://leetcode.com/problems/longest-substring-without-repeating-characters
```
use a map to keep latest index of every char and use 2 pointers
```
- https://leetcode.com/problems/container-with-most-water
```
Greedy. sort and keep poping maxes. every time, if the max expands the window, update window start and end index and see if max changes
```
- https://leetcode.com/problems/3sum
```
Sort first. for i 0..len start j from i + 1 to forward and k from len - 1 to backwards
```
- https://leetcode.com/problems/minimum-window-substring/
```
two pointers. move right until you find all chars you need. use a map to count chars in current window and target string. and keep track of number of characters which you
have enough counts for. when you see reach the window with all chars counts satisfied save this substring and move left forward untill the window becomes invalid again.
```