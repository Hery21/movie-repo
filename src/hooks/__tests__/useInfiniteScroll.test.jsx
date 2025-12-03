import { renderHook, act } from "@testing-library/react";
import { useInfiniteScroll } from "../useInfiniteScroll";
import { vi, describe, it, expect, beforeEach } from "vitest";

const observeMock = vi.fn();
const disconnectMock = vi.fn();

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    MockIntersectionObserver.instance = this;
  }
  observe = observeMock;
  disconnect = disconnectMock;
  triggerIntersect(isIntersecting = true) {
    this.callback([{ isIntersecting }]);
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver;

describe("useInfiniteScroll", () => {
  beforeEach(() => {
    observeMock.mockClear();
    disconnectMock.mockClear();
    MockIntersectionObserver.instance = null;
  });

  it("creates an observer and observes the node", () => {
    const onLoadMore = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll(true, false, onLoadMore)
    );

    const refCallback = result.current;

    const node = document.createElement("div");

    act(() => {
      refCallback(node);
    });

    expect(disconnectMock).not.toHaveBeenCalled();
    expect(observeMock).toHaveBeenCalledWith(node);
  });

  it("does not observe or create observer when loading is true", () => {
    const onLoadMore = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll(true, true, onLoadMore)
    );

    const refCallback = result.current;

    const node = document.createElement("div");

    act(() => {
      refCallback(node);
    });

    expect(observeMock).not.toHaveBeenCalled();
    expect(disconnectMock).not.toHaveBeenCalled();
  });

  it("calls onLoadMore when element intersects and hasMore=true", () => {
    const onLoadMore = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll(true, false, onLoadMore)
    );

    const node = document.createElement("div");

    act(() => {
      result.current(node);
    });

    act(() => {
      MockIntersectionObserver.instance.triggerIntersect(true);
    });

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("does NOT call onLoadMore when hasMore=false", () => {
    const onLoadMore = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll(false, false, onLoadMore)
    );

    const node = document.createElement("div");

    act(() => {
      result.current(node);
    });

    act(() => {
      MockIntersectionObserver.instance.triggerIntersect(true);
    });

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("disconnects previous observer when node changes", () => {
    const onLoadMore = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll(true, false, onLoadMore)
    );

    const refCallback = result.current;

    const nodeA = document.createElement("div");
    const nodeB = document.createElement("div");

    act(() => refCallback(nodeA));
    act(() => refCallback(nodeB));

    expect(disconnectMock).toHaveBeenCalledTimes(1);

    expect(observeMock).toHaveBeenCalledTimes(2);
  });

  it("does nothing when ref receives null", () => {
    const onLoadMore = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll(true, false, onLoadMore)
    );

    act(() => {
      result.current(null);
    });

    expect(observeMock).not.toHaveBeenCalled();
  });
});
