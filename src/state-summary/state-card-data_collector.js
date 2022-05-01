import "@polymer/iron-flex-layout/iron-flex-layout-classes";
import { html } from "@polymer/polymer/lib/utils/html-tag";
/* eslint-plugin-disable lit */
import { PolymerElement } from "@polymer/polymer/polymer-element";
import "../components/entity/state-info";

class StateCardDataCollector extends PolymerElement {
  static get template() {
    return html`
      <style include="iron-flex iron-flex-alignment"></style>

      <div class="horizontal justified layout">${this.stateInfoTemplate}</div>
    `;
  }

  static get stateInfoTemplate() {
    return html`
      <state-info
        hass="[[hass]]"
        state-obj="[[stateObj]]"
        in-dialog="[[inDialog]]"
      ></state-info>
    `;
  }
}
customElements.define("state-card-data_collector", StateCardDataCollector);
