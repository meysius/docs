# Hooks
Must always be used in the root of functional components.

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
		- Rule of thumb: if effect function uses a variable of state or props that changes it should be declared as a dependency.
	- If you give it empty array
		- It runs the function after first render (and every time one of the dependencies changed which is never because there is no dependencies)
		- The cleanup runs when unmounting.

To summarize: Every execution of the effect runs after a certain render and it has a cleanup which runs when rendered DOM is being removed either for unmounting or for another render.  

# useCallback

```
  useCallback(
  	() => { ... }, // callback function
  	[dep1, dep2, ...]
  )
```

This hook is used when a function needs to be passed down to other components as a callback. We do not want this callback function to be re-evaluated everytime wrapping component is re-rendered because that will create performance or infinite lookp issues in children components. useCallback caches the function and re-evaluates it only when one of the dependencies change.

# use Reducer
 
Define the reducer funtion first
```js
const myReducer = (state, action) => {
	switch (action.type) {
		case 'A':
			return newState;
		case 'B':
			return newState;
		default:
			return newState;
	}
}
```

Then in the functional component:
```js
const [state, dispatch] = useReducer(myReducer, initState);
```

Whenever your redecuer changes its state, React renders the entire c omponent again.

# useMemo
```
useMemo(
	() => { return whatYouNeedMemorized },
  [dep1, dep2, ...]
)
```

This is used for caching components and avoid unnecessary re-renders.


# Custom Hooks

Custom hooks are stateful logics we can extract and reuse. all other hooks can be used in making a custom hook and it is as if the body of that hook is directly written in whatever component the hook is used in.

Ex:
```js
import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not be reached!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifer) => {
      dispatchHttp({ type: 'SEND', identifier: reqIdentifer });
      fetch(url, {
        method: method,
        body: body,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          return response.json();
        })
        .then(responseData => {
          dispatchHttp({
            type: 'RESPONSE',
            responseData: responseData,
            extra: reqExtra
          });
        })
        .catch(error => {
          dispatchHttp({
            type: 'ERROR',
            errorMessage: 'Something went wrong!'
          });
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifer: httpState.identifier,
    clear: clear
  };
};

export default useHttp;

```

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

Create a context
```js
const MyContext = React.createContext({ a: 1, b: 2 })
```

Wrap around a root component
```jsx
<MyContext.Provider value={{ a: 1, b: 2 }}></MyContext.Provider>
```

Consuming context in jsx
```js
<MyContext.Consumer>
  {
  	(context) => { return ... }
  }
</MyContext.Consumer>
```

Consuming context in class component
Add to class body:
```js
static contextType = MyContext;
```

Then in any method of class
```js
this.context.a
```

Consuming context in functional component
```js
import { useContext } from 'react';
const myContext = useContext(MyContext);
myContext.a
```