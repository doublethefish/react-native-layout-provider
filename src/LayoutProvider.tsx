import { Component, Children } from "react";
import { Dimensions } from "react-native";
import shallowEqual from "shallowequal";

const { width: defaultWidth, height: defaultHeight } = Dimensions.get("window");

interface LayoutProps {
  label?: string;
  width?: number;
  height?: number;
  portrait?: boolean;
  children?: any;
}

interface LayoutState {
  label?: string;
  viewport?: { width: number; height: number };
  portrait?: boolean;
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

    const defaultState: LayoutState = {
      label: "Default",
      viewport: {
        width: defaultWidth,
        height: defaultHeight,
      },
      portrait: undefined,
    };

    const propsState:LayoutState = this.propsToState(props);

    this.state = {
      ...defaultState,
      ...propsState,
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

    const newState = this.propsToState(nextProps);
    this.setState(newState);
  }

  shouldComponentUpdate(nextProps: LayoutProps, nextState: LayoutState) {
    return (
      !shallowEqual(this.state, nextState) ||
      this.props.children !== nextProps.children
    );
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

  propsToState(
    { label, width, height, portrait }: LayoutProps
    ):LayoutState {
    const newState: LayoutState = {};
    if (label !== undefined) {
      newState["label"] = label;
    }

    if (width !== undefined) {
      newState["viewport"]["width"] = width;
    }

    if (height !== undefined) {
      newState["viewport"]["height"] = height;
    }

    if (portrait !== undefined) {
      newState["portrait"] = portrait;
    }
    return newState;
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
