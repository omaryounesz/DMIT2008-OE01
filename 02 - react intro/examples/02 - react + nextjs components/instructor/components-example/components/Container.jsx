export default function Container({ children }) {
  // 'children' is a hardcoded prop for anything nested inside that component when it's called.
  // It is automatically passed if you take all your props in as one argument (e.g. props -> props.children),
  // but you need to specifically name it in the function's inputs if destructuring (i.e. { children} ).

  // What we get here is basically an empty component that will render whatever is nested inside it when called in JSX.
  return (
    <>
      {children}
    </>
  )
}
