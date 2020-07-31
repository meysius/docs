# useEffect

```
  useEffect(
  	() => { ... }, // effect function
  	[dep1, dep2, ...]
  )
```

This hooks is used when we want to cause side effects in functional components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.

This hook runs after every time react updates the DOM (that includes the first render plus every time the props of the component changes); but you can control this. You can also return a cleanup function in the effect function.

	- If you dont pass any thing as the second arg
		- The effect function runs after first render and every time any props changed. The cleanup runs before every re-render.
	- If you give it dependencies
		- The effect function runs after first render and every time one of the dependencies changed. The cleanup runs before every re-render.
	- If you give it empty array
		- It runs the function after first render (and every time one of the dependencies changed which is never because there is no dependencies)
		- The cleanup runs when unmounting.

To summarize: Every execution of the effect runs after a certain render and it has a cleanup which runs when rendered DOM is being removed either for unmounting or for another render.  


# shouldComponentUpdate(nextProps, nextState) => { return true || false }

Used for optimizing re-renders and stop unnecessary re-renders

# export with React.memo(ComponentName)

makes the component only re-render if props have changed

# extend from PureComponent

this base class has a pre-written shouldComponentUpdate which checks all props and if they are updated and then it allows or stops the render if props are not changed

# HOC Example

```js
const withSomething = (WrappedComponent, arg1) => {
	return props => (
		<div x={arg1}>
			<WrappedComponent {...props} />
		</div>
	);
}
```

# Updating the state based on prevState
```js
this.setState((prevState, props) => {
	return {
		attr: prevState.attr + 1
	}
})
```

# Prop Types
- Install `prop-types`
```js
import PropTypes from 'prop-types';

Person.propTypes = {
	click: PropTypes.func,
	name: PropTypes.string,
	age: Proptypes.number
}
```

# Setting ref
1 - you could do:
```js
<input ref={(e) => this.input = e} />

this.input.focus();
```

2 - you can also do:
```js
constructor(props) {
	super(props);
	this.input = React.createRef();
}
<input ref={this.input} />
this.input.current.focus();
```

3 - in functional components:
```js
import { useRef } from 'react';

const myRef = useRef(null); // null is initial value
<input ref={this.myRef} />
this.myRef.current.focus();
```

# Context
Context is used when u want to share some stuff with an entire component subtree instead of flowing props down all the way from root to leaf.


```jsx
const MyContext = React.createContext({ a: 1, b: 2 })

<!-- wrap around a root component -->
<MyContext.Provider value={{ a: 1, b: 2 }}></MyContext.Provider>

<!-- Consuming context in jsx -->
<MyContext.Consumer>
  {
  	(context) => { return ... }
  }
</MyContext.Consumer>

<!-- Accessing context from class component add to class body: -->
static contextType = MyContext;
<!-- then in any method of class: -->
this.context.a

<!-- Or in functional components: -->
import { useContext } from 'react';

const myContext = useContext(MyContext);
myContext.a
```