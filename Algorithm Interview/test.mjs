
function top(stack) {
  return stack[stack.length - 1];
}

function closestLessOnLeft(nums) {
  const result = Array(nums.length).fill(-1)
  const stack = []
  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[top(stack)] >= nums[i]) {
      stack.pop()
    }
    result[i] = top(stack) || -1
    stack.push(i)
  }
  return result
}

function closestGreaterOnLeft(nums) {
  let result = Array(nums.length).fill(-1)
  let stack = []
  for (let i = 0; i < nums.length; i++) {
    while(stack.length > 0 && nums[top(stack)] <= nums[i]) {
      stack.pop()
    }
    result[i] = top(stack) || -1
    stack.push(i)
  }
  return result;
}


function closestLessOnRight(nums) {
  let result = Array(nums.length).fill(nums.length);
  let stack = []
  for (let i = nums.length - 1; i >= 0; i--) {
    while (stack.length > 0 && nums[top(stack)] >= nums[i]) {
      stack.pop()
    }
    result[i] = top(stack) || nums.length;
    stack.push(i)
  }
  return result
}

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

console.log(lessRight([  2,  1,  5,  6,  2,  3]))
console.log(closestLessOnRight([  2,  1,  5,  6,  2,  3]))