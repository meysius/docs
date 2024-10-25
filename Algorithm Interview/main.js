
function top(stack) {
  return stack[stack.length - 1]
}

function lessLeft(nums) {
  const result = Array(nums.length).fill(-1)
  const stack = []
  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[top(stack)] > nums[i]) {
      stack.pop()
    }
    result[i] = stack.length > 0 ? top(stack) : -1
    stack.push(i)
  }

  return result
}

function lessRight(nums) {
  const result = Array(nums.length).fill(nums.length)
  const stack = []
  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[top(stack)] > nums[i]) {
      result[stack.pop()] = i
    }
    stack.push(i)
  }
  return result
}


function greaterLeft(nums) {
  const result = Array(nums.length).fill(-1)
  const stack = []
  for (let i = 0; i < nums.length; i++) {
    while(stack.length > 0 && nums[top(stack)] < nums[i]) {
      stack.pop()
    }
    result[i] = stack.length > 0 ? top(stack) : -1
    stack.push(i)
  }
  return result
}

function greaterRight(nums) {
  result = Array(nums.length).fill(nums.length)
  stack = []
  for (let i = 0; i < nums.length; i++) {
    while(stack.length > 0 && nums[top(stack)] < nums[i]) {
      result[stack.pop()] = i
    }
    stack.push(i)
  }
  return result
}
// ----

function test(func, input, expect) {
  const render = (arr) => arr.join(", ")
  console.log(`test ${func.name}`)
  console.log(`Input: ${render(input)}`)
  console.log(`Expected: ${render(expect)}`)

  const result = func(input)
  if (expect.toString() == result.toString()) {
    console.log('> OK')
  } else {
    console.log('> FAILED. got:')
    console.log(result)
  }
  console.log('-----')
}

// test(
//   lessLeft,
//   [  2,  1,  5,  6,  2,  3],
//   [ -1, -1,  1,  2,  1,  4]
// )

// test(
//   lessRight,
//   [  2,  1,  5,  6,  2,  3],
//   [  1,  6,  4,  4,  6,  6]
// )

// test(
//   greaterLeft,
//   [  2,  1,  5,  6,  2,  3],
//   [ -1,  0, -1, -1,  3,  3]
// )

// test(
//   greaterRight,
//   [  2,  1,  5,  6,  2,  3],
//   [  2,  2,  3,  6,  5,  6]
// )


/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
    const hash = new Set(wordDict);
    const dp = [-1];
    for (let i = 0; i < s.length; i++) {
      const firstMatch = dp.findIndex(j => {
        const rest = s.substring(j + 1, i + 1);
        console.log(rest);
        return hash.has(rest);
      });
      if (firstMatch !== -1) {
        dp.push(i);
      }
    }
    return dp[dp.length - 1] === s.length - 1;
};

console.log(wordBreak("leetcode", ["leet", "code"]))