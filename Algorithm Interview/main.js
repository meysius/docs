
function top(stack) {
  return stack[stack.length - 1]
}

function closestLessOnLeft(nums) {
  const result = Array(nums.length).fill(-1)
  const stack = []
  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[top(stack)] >= nums[i]) {
      stack.pop()
    }
    result[i] = stack.length > 0 ? top(stack) : -1
    stack.push(i)
  }

  return result
}

function closestLessOnRight(nums) {
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


function closestGreaterOnLeft(nums) {
  const result = Array(nums.length).fill(-1)
  const stack = []
  for (let i = 0; i < nums.length; i++) {
    while(stack.length > 0 && nums[top(stack)] <= nums[i]) {
      stack.pop()
    }
    result[i] = stack.length > 0 ? top(stack) : -1
    stack.push(i)
  }
  return result
}

function closestGreaterOnRight(nums) {
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

test(
  closestLessOnLeft,
  [  2,  1,  5,  6,  2,  3],
  [ -1, -1,  1,  2,  1,  4]
)

test(
  closestLessOnRight,
  [  2,  1,  5,  6,  2,  3],
  [  1,  6,  4,  4,  6,  6]
)

test(
  closestGreaterOnLeft,
  [  2,  1,  5,  6,  2,  3],
  [ -1,  0, -1, -1,  3,  3]
)

test(
  closestGreaterOnRight,
  [  2,  1,  5,  6,  2,  3],
  [  2,  2,  3,  6,  5,  6]
)