import "@material/mwc-list/mwc-list-item";
import "@polymer/iron-flex-layout/iron-flex-layout-classes";
import { html } from "@polymer/polymer/lib/utils/html-tag";
/* eslint-plugin-disable lit */
import { PolymerElement } from "@polymer/polymer/polymer-element";
import { EventsMixin } from "../../../mixins/events-mixin";
import LocalizeMixin from "../../../mixins/localize-mixin";

class MoreInfoDataCollector extends LocalizeMixin(EventsMixin(PolymerElement)) {
  static get template() {
    return html`
      <style include="iron-flex"></style>

      <div>
        <p>this is a test</p>
        <p />
        <div />

        <ha-attributes hass="[[hass]]" state-obj="[[stateObj]]"></ha-attributes>
      </div>
    `;
  }
}
customElements.define("more-info-data_collector", MoreInfoDataCollector);
