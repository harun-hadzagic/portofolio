import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";

// jsdom ships none of these; without them the page cannot mount at all.
beforeAll(() => {
  const ctx2d = new Proxy({}, { get: () => () => {} });
  HTMLCanvasElement.prototype.getContext = () => ctx2d;

  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  global.IntersectionObserver = class {
    constructor(cb) {
      this.cb = cb;
    }
    observe() {
      this.cb([{ isIntersecting: true, intersectionRatio: 1 }]);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  });
  window.scroll = () => {};
  Element.prototype.scrollTo = () => {};
});

test("renders the page without runtime errors", async () => {
  const errors = [];
  const spy = jest.spyOn(console, "error").mockImplementation((...args) => {
    errors.push(args.join(" "));
  });

  const App = (await import("./App")).default;
  render(<App />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Harun Hadzagic"
  );
  expect(screen.getByRole("link", { name: /skip to content/i })).toBeInTheDocument();
  expect(screen.getByRole("main")).toBeInTheDocument();
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();

  // Form controls must have accessible names.
  expect(screen.getByLabelText("Full name")).toBeInTheDocument();
  expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  expect(screen.getByLabelText("Message")).toBeInTheDocument();

  // Menu button exposes its state. Queried by attribute rather than by
  // role+name: it is display:none at the jsdom default width, and accessible
  // name computation returns "" inside a hidden subtree.
  const menuButton = document.querySelector('button[aria-label="Open menu"]');
  expect(menuButton).not.toBeNull();
  expect(menuButton).toHaveAttribute("aria-expanded", "false");
  expect(menuButton).toHaveAttribute("aria-controls", "primary-navigation");

  // Carousel rails are focusable and labelled.
  const rails = screen.getAllByRole("group", { name: /projects|testimonials/i });
  expect(rails.length).toBeGreaterThanOrEqual(2);
  rails.forEach((rail) => expect(rail).toHaveAttribute("tabindex", "0"));

  expect(errors).toEqual([]);
  spy.mockRestore();
});
