
// function top(stack) {
//   return stack[stack.length - 1]
// }

// function lessLeft(nums) {
//   const result = Array(nums.length).fill(-1)
//   const stack = []
//   for (let i = 0; i < nums.length; i++) {
//     while (stack.length > 0 && nums[top(stack)] > nums[i]) {
//       stack.pop()
//     }
//     result[i] = stack.length > 0 ? top(stack) : -1
//     stack.push(i)
//   }

//   return result
// }

// function lessRight(nums) {
//   const result = Array(nums.length).fill(nums.length)
//   const stack = []
//   for (let i = 0; i < nums.length; i++) {
//     while (stack.length > 0 && nums[top(stack)] > nums[i]) {
//       result[stack.pop()] = i
//     }
//     stack.push(i)
//   }
//   return result
// }


// function greaterLeft(nums) {
//   const result = Array(nums.length).fill(-1)
//   const stack = []O
//   for (let i = 0; i < nums.length; i++) {
//     while(stack.length > 0 && nums[top(stack)] < nums[i]) {
//       stack.pop()
//     }
//     result[i] = stack.length > 0 ? top(stack) : -1
//     stack.push(i)
//   }
//   return result
// }

// function greaterRight(nums) {
//   result = Array(nums.length).fill(nums.length)
//   stack = []
//   for (let i = 0; i < nums.length; i++) {
//     while(stack.length > 0 && nums[top(stack)] < nums[i]) {
//       result[stack.pop()] = i
//     }
//     stack.push(i)
//   }
//   return result
// }

function top(stack) {
  return stack[stack.length - 1]
}


// For example for nums = [  2,  1,  5,  6,  2,  3]
// We are looking for     [ -1,  0, -1, -1,  3,  3]

function greaterLeft(nums) {
  const res = Array(nums.length).fill(-1)
  const stack = []
  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[top(stack)] < nums[i]) {
      stack.pop()
    }
    res[i] = stack.length > 0 ? top(stack) : -1
    stack.push(i)
  }
  return result
}