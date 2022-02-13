import { Component, Children } from "react";
import { Dimensions } from "react-native";
import shallowEqual from "shallowequal";

const { width: defaultWidth, height: defaultHeight } = Dimensions.get("window");

interface LayoutProps {
  label: string;
  width: number;
  height: number;
  portrait: boolean;
  children: any;
}

interface LayoutState {
  label: string;
  viewport: { width: number; height: number };
  portrait: boolean;
}

type CallbackType = (layout: LayoutState) => void;

export default class LayoutProvider extends Component<
  LayoutProps,
  LayoutState
> {
  listeners: CallbackType[];

  constructor(props: LayoutProps) {
    super(props);
    this.listeners = [];
    this.update = this.update.bind(this);
    this.getLayoutState = this.getLayoutState.bind(this);
    this.subscribeLayout = this.subscribeLayout.bind(this);
    this.setLayoutState(props);

    const defaultWidth = -1; // this wasn't defined in the original
    const defaultHeight = -1; // this wasn't defined in the original

    this.state = {
      label: "Default",
      viewport: {
        width: defaultWidth,
        height: defaultHeight,
      },
      portrait: false,
    };
  }

  getChildContext() {
    return {
      getLayoutProviderState: this.getLayoutState,
      subscribeLayout: this.subscribeLayout,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: LayoutProps) {
    if (shallowEqual(this.props, nextProps)) return;

    this.setLayoutState(nextProps, this.update);
  }

  shouldComponentUpdate(nextProps: LayoutProps, nextState: LayoutState) {
    return (
      !shallowEqual(this.state, nextState) ||
      this.props.children !== nextProps.children
    );
  }

  setLayoutState(
    { label, width, height, portrait }: LayoutProps,
    callback?: () => void
  ) {
    const state: LayoutState = {
      label,
      viewport: { width, height },
      portrait,
    };
    if (!this.state) {
      this.state = state;
    } else {
      this.setState(state, callback);
    }
  }

  getLayoutState(): LayoutState {
    const {
      label,
      viewport: { width, height },
      portrait,
    } = this.state;
    return {
      label,
      viewport: { width, height },
      portrait,
    };
  }

  subscribeLayout(listener: CallbackType) {
    if (typeof listener !== "function") {
      throw new Error("Expected listener to be a function.");
    }

    let isSubscribed = true;

    this.listeners.push(listener);

    return () => {
      if (!isSubscribed) return;

      isSubscribed = false;

      const index = this.listeners.indexOf(listener);
      this.listeners.splice(index, 1);
    };
  }

  update() {
    this.listeners.forEach((listener) => listener(this.getLayoutState()));
  }

  render() {
    return Children.only(this.props.children);
  }
}
