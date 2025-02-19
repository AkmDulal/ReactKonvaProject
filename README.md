# Next.js Drawing App

## Overview

This is a Next.js-based drawing application that leverages **Konva** and **react-konva** for dynamic canvas rendering, along with **react-icons** for an intuitive UI. The app allows users to create and manipulate shapes, supports undo/redo functionality, and provides an option to download the final artwork. All user actions are stored in local storage to maintain session history.

## Features

- **Shape Creation & Manipulation**: Draw and resize shapes dynamically.
- **Undo & Redo**: Step backward and forward through edit history.
- **Persistent State**: Saves all actions in local storage for session retention.
- **Download Feature**: Export your drawing as an image.
- **Cursor Selection for Editing**: After creating a shape, selecting **GiArrowCursor** allows resizing the shape.

## Installation

To set up the project, clone the repository and install dependencies:

```sh
npm install or yarn
```

## Running the Project

Start the development server with:

```sh
npm run dev or yarn dev
```

The application will be available at [http://localhost:3000](https://react-konva-project.vercel.app/).

## Technologies Used

### 1. [Konva](https://konvajs.org/)

Konva is a 2D canvas library that provides powerful drawing capabilities. It enables smooth interaction with objects on the canvas and supports transformations like scaling and dragging.

### 2. [react-konva](https://konvajs.org/docs/react/)

A React wrapper around Konva, allowing seamless integration with React applications. It provides declarative components for shapes, layers, and event handling.

### 3. [react-icons](https://react-icons.github.io/react-icons/)

A lightweight icon library that integrates popular icon sets with React. Used for UI enhancements like the **GiArrowCursor** tool.

## Usage

### Shape Creation & Editing

1. Select a shape tool (rectangle, circle, etc.).
2. Click and drag on the canvas to draw.
3. To resize a shape, first select **GiArrowCursor**, then interact with the shape.

### Undo & Redo

- **Undo**: Revert the last action.
- **Redo**: Restore the previously undone action.

### Downloading Your Drawing

Click the **Download** button to save the canvas as an image file.

## Contribution

Feel free to contribute by submitting pull requests or reporting issues. Ensure proper coding standards are followed before making changes.

## License

This project is open-source and available under the [MIT License](LICENSE).

please write README.md code&#x20;

