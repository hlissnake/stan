### App Demo:

[Stan App.webm](https://github.com/user-attachments/assets/045f3050-11b2-4a8a-9cc7-da2df5a0de5d)

### Running Project

```
npm start
```

Then open http://localhost:3000/

### Architecture Design

- Using Babel + Webpack bioleplate to build and run the web app
- TS, React, Redux-Toolkit, Styled-Components, React Router;

#### State management

Typical Redux-Toolkit bioleplate in the project, only one slice called **Programs** in reducer.
The only different thing is: I'm using the **Normalizerd** Data Structure instead of List only, as the state bioleplate:

```typescript
  programs: {
    byIds: Record<string, Program>;
    ids: string[];
  };
```

#### Page framework

Home page is the root path, Program is rendered as a sub-router under the Home path.
This is for Carousel Selected index restore if backspace from Program to Home page.

```
App
├── Home (/)
│   └── Program (/program/:id)
│
```

I copy the same layout pattern from current **Stan main site**, and using some of the same CSS vars as well.
Currently only support 720P and 1080P responsive screen size

```css
--entry-gutter-x: 0.5rem;
--entry-gutter-y: 0.5rem;
--entry-count-grid: 5; /* default for 720p */
--layout-gutter: 2rem;
--layout-max-width: 120rem;
--component-margin: 2rem;
--background-color: #141414;
--colour-stan-blue: #0072fb;
--colour-white-20: hsla(0, 0%, 100%, 0.2);
--font-family: "Garet", sans-serif;
```

#### Home page

Core Component: **StanIamge**, **Carousel**

- **StanImage**: Image component which is only rendering inside the viewport screen, with image src lazy load. This component has been used for Home Carousel and Program both.

  - **IntersectionObserver** for detecting viewport inside
  - **Preload image** src when Image DOM element render and mount

- **Carousel**:
  [Carousel README.md](https://github.com/hlissnake/stan/tree/main/src/components/Carousel/README.md)

  - Core requirement: No more than six carousel images should be in the DOM at any time.
    I'm not just limit image dom elements less than 6, it really depend on the responsive screen size:

    - 720P: 5 images in screen, but total 7 items visible (before start and after end)
    - 1080P: 8 images in screen, but total 10 items visible

    Imagee profermance solutions:

    1. **In Screen calculation**

       - Tracks visible items using `startVisible` and `endVisible`
       - Only renders items within the viewport

    2. **Use StanImage IntersectionObserver**

       - simple Native Web API, no complex math calculation. only consider for the Device Browser Support

    3. **(TODO) Virtual Scrolling**
       - Consider for using @tanstack/react-virtual in the next step as the 3rd solution;

#### Program page

Reuse the **StanImage** component for image src lazy preloading

When **backspace** to Home page, should recover the selected Carousel item status

1. **Local State presist solution**:

   - Need to presist the Carousel selection in Redux local state;
   - Carousel component to receive the initial item selected index to make translate movement;
   - Trade-off:
     - Clear Pages framework as Home and Program are seperate;
     - But complex logic on calculation, also with extra transition animation when restoring from backspace

2. **Program page renderred as sub-router under Home path**:

   - Home page will not un-mounted from DOM, so the Carousel component state is remained
   - Trade-off:
     - More memory usage in DOM element for Program page;
     - Less Home Carousel DOM element mount and re-render;
     - Easy for maintain, less calculation logic;

### Component Unit Testing

- Home Carousel, test case cover:

  - Loading skeleton
  - Track movement: render elements only inside viewport when moving track
  - Keyboard Selection
  - Responsive Screen Size for item visible

- Program, test case cover:
  - Program Content Display
  - Redux state
  - Navigation on backspace
  - URL parameters
