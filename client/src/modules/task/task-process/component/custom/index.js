import CustomContextPad from './CustomContextPad';
import CustomPalette from './CustomPalette';
import CustomRenderer from './CustomRenderer';
<<<<<<< HEAD
=======
// import CustomDrag from './CustomDrag'
// export default {
//   _init_: ['customContextPad', 'customPalette', 'customRenderer', 'customDrag'],
//   customContextPad: ['type', CustomContextPad],
//   customPalette: ['type', CustomPalette],
//   customRenderer: ['type', CustomRenderer],
//   customDrag: ['type', CustomDrag]
// };
>>>>>>> 3c86773584867f85ef44e26a41700cf1705a362b
export default {
  __init__: ['customContextPad', 'customPalette', 'customRenderer'],
  customContextPad: ['type', CustomContextPad],
  customPalette: ['type', CustomPalette],
  customRenderer: ['type', CustomRenderer],
};