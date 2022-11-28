import React from "react";
import { View } from "react-native";
import { mount } from "enzyme";
import LayoutProvider from "../src/LayoutProvider";
import expect from "expect";
import spyLifeCycle from "spy-react-component-lifecycle";

const defaultState = {
  label: "Default",
  viewport: {
    width: 750,
    height: 1334,
  },
  portrait: undefined,
};

describe("<LayoutProvider />", () => {
  beforeEach(() => {
    spyLifeCycle(LayoutProvider);
  });

  it("should render successful", () => {
    const wrapper = mount(
      <LayoutProvider>
        <View />
      </LayoutProvider>
    );
    expect(wrapper.state()).toEqual(defaultState);
    expect(wrapper.find(View).type().displayName).toBe("View");
  });

  it("should change state with set new props", () => {
    const spy = jest.spyOn(LayoutProvider.prototype, "UNSAFE_componentWillReceiveProps");
    const wrapper = mount(
      <LayoutProvider>
        <View />
      </LayoutProvider>
    );
    expect(wrapper.state()).toEqual(defaultState);
    wrapper.setProps({
      portrait: true,
    });
    expect(wrapper.state()).toEqual({
      ...defaultState,
      portrait: true,
    });
    expect(spy).toBeCalledTimes(1);
  });

  it("should not re-render with set the same props", () => {
    const renderSpy = jest.spyOn(LayoutProvider.prototype, "render");
    const wrapper = mount(
      <LayoutProvider>
        <View />
      </LayoutProvider>
    );
    expect(wrapper.state()).toEqual(defaultState);

    const { render } = LayoutProvider.prototype;
    expect(renderSpy).toBeCalledTimes(1);

    wrapper.setProps({
      portrait: undefined,
    });
    expect(renderSpy).toBeCalledTimes(1);
  });
});
