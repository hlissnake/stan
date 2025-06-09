# Carousel Component

A responsive, keyboard-navigable carousel component designed for TV and web streaming interfaces. The component supports lazy loading, infinite scrolling, and dynamic screen size adaptation.

## Core Features

- **Responsive Design**: Adapts to different screen sizes (XXL, XL, LG, MD, SM)
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Lazy Loading**: Optimizes performance by loading content only when visible
- **Smooth Transitions**: Hardware-accelerated animations for smooth sliding
- **Loading States**: Handles loading states with placeholder UI
- **TypeScript Support**: Fully typed with generic support for different data structures

## Architecture

### Component Structure

```
Carousel
├── CarouselContainer (styled.div)
│   └── CarouselTrack (styled.div)
│       └── CarouselSlide (styled.div)
│           └── Children (render prop)
```

### Key Components

1. **CarouselContainer**
   - Manages the viewport and overflow
   - Handles padding and layout constraints
   - Supports TV screen optimization (1920px+)

2. **CarouselTrack**
   - Manages the sliding container
   - Handles transform transitions
   - Maintains gap between slides

3. **CarouselSlide**
   - Individual slide container
   - Manages selection state
   - Handles loading and visibility states
   - Maintains aspect ratio (228:342)

### State Management

```typescript
interface CarouselState {
  currentSlide: number;    // Current page index
  translateX: number;      // Current transform position
  startVisible: number;    // First visible item index
  endVisible: number;      // Last visible item index
  selectedIndex: number;   // Currently selected item
}
```

### Props Interface

```typescript
interface CarouselProps<T> {
  data: T[];              // Array of items to display
  isLoading?: boolean;    // Loading state
  initialSlide?: number;  // Initial slide index
  onEnter: (index: number) => void;  // Selection callback
  children: (slide: T, index: number) => React.ReactNode;  // Render prop
}
```

## Implementation Details

### 1. Responsive Design

The carousel adapts to screen sizes using CSS custom properties and the `useScreenSize` hook:

```typescript
const slidePageSize = useMemo(() => {
  switch (screenSize) {
    case "XXL": return 8;  // 1080p
    default: return 5;     // Other sizes
  }
}, [screenSize]);
```

### 2. Navigation System

- **Keyboard Navigation**: Implemented via `useKeyboardNavigation` hook
- **Selection Tracking**: Maintains selected index and updates current slide
- **Boundary Handling**: Prevents navigation beyond data boundaries

### 3. Performance Optimizations

1. **Lazy Loading**
   - Tracks visible items using `startVisible` and `endVisible`
   - Only renders items within the viewport

2. **Transition Optimization**
   - Uses CSS transform for hardware acceleration
   - Implements smooth transitions with `transition: transform 0.5s ease-in-out`
   - Calculates transform based on current slide and page size

3. **Render Optimization**
   - Memoized calculations for slide page size
   - Conditional rendering based on visibility
   - Efficient state updates

### 4. Loading State

```typescript
if (isLoading) {
  const dummyData = Array(slidePageSize + 1).fill(0);
  return (
    <CarouselContainer>
      <CarouselTrack>
        {dummyData.map((_, index) => (
          <CarouselSlide key={index} isLoading isInView />
        ))}
      </CarouselTrack>
    </CarouselContainer>
  );
}
```

## Usage Example

```typescript
<Carousel
  data={programs}
  isLoading={status === "loading"}
  onEnter={handleEnter}
>
  {(program) => (
    <Link to={`/program/${program.id}`}>
      <StanImage 
        src={program.image} 
        alt={`${program.title} poster`} 
      />
    </Link>
  )}
</Carousel>
```

## CSS Custom Properties

The component uses CSS custom properties for flexible styling:

```css
:root {
  --layout-gutter: 16px;
  --entry-gutter-x: 8px;
  --entry-count-grid: 5;  /* Dynamic based on screen size */
  --colour-stan-blue: #00ADEF;
  --colour-white-20: rgba(255, 255, 255, 0.2);
}
```

## Future Improvements

- **Virtual Scrolling** consider for using @tanstack/react-virtual
   - Implement virtual scrolling for large datasets
   - Optimize memory usage for long lists

## Trade-offs and Considerations

1. **Visibility Calculation**
   - Current: Manual calculation based on indices
   - Future: IntersectionObserver for more accurate detection
   - Trade-off: Complexity vs. Performance

2. **Memory Usage**
   - Current: Renders all items in DOM
   - Future: Virtual scrolling for large datasets
   - Trade-off: Memory vs. Implementation complexity
