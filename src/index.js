import { o, html } from "sinuous";
import { map } from "sinuous/map";
import { root } from "sinuous/observable";
import { memo } from "sinuous/memo";

const app = () => {
  let items = o([0, 1]);
  console.log("app...");

  const view = html`
    <h3>Dynamic Components</h3>
    <button onclick=${addToList}>
      Add to List
    </button>
    <button onclick=${switchComponent}>
      Switch Component
    </button>
    <hr />
    <${dynamic(list)} items="${items}">
      <p>I am a child</p>
      <p>I am a child too</p>
    <//>
  `;

  function addToList(e) {
    items(items().concat(items().length));
  }

  return view;
};

const memoComp = memo(comp => {
  return memo((props, children) => {
    return root(() => comp(props, children));
  });
});

const dynamic = comp => {
  return (props, ...children) => {
    return () => memoComp(comp())(props, children);
  };
};

function switchComponent() {
  if (list() === component1) {
    list(component2);
  } else {
    list(component1);
  }
}

const component1 = ({ items }, ...children) => {
  console.log("comp1", children);
  return html`
    list
    <ul>
      ${map(items, item => html`
        <li id=${item}>${item}</li>
      `)}
    </ul>
    ${children}
  `;
};

const component2 = ({ items }, ...children) => {
  console.log("comp2", children);
  return html`
    list ** 2
    <ul>
      ${map(items, item => html`
      	<li id=${item}>${item ** 2}</li>
			`)}
    </ul>
    ${children}
  `;
};

const list = o(component1);

document.querySelector(".dynamic-example").append(app());
