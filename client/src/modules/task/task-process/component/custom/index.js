import CustomContextPad from './CustomContextPad';
import CustomPalette from './CustomPalette';
import CustomRenderer from './CustomRenderer';
// import CustomDrag from './CustomDrag'
// export default {
//   _init_: ['customContextPad', 'customPalette', 'customRenderer', 'customDrag'],
//   customContextPad: ['type', CustomContextPad],
//   customPalette: ['type', CustomPalette],
//   customRenderer: ['type', CustomRenderer],
//   customDrag: ['type', CustomDrag]
// };
export default {
  __init__: [ 'customContextPad', 'customPalette', 'customRenderer' ],
  customContextPad: [ 'type', CustomContextPad ],
  customPalette: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ]
};