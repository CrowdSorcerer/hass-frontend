import { css, html, LitElement, TemplateResult } from "lit";
import { property, state } from "lit/decorators";
import { fireEvent } from "../../../../common/dom/fire_event";
import "../../../../components/ha-card";
import "../../../../components/ha-chip";
import "../../../../components/ha-chip-set";
import { showAutomationEditor } from "../../../../data/automation";
import {
  DeviceAction,
  DeviceAutomation,
} from "../../../../data/device_automation";
import { showScriptEditor } from "../../../../data/script";
import { buttonLinkStyle } from "../../../../resources/styles";
import { HomeAssistant } from "../../../../types";

declare global {
  interface HASSDomEvents {
    "entry-selected": undefined;
  }
}

export abstract class HaDeviceAutomationCard<
  T extends DeviceAutomation
> extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public deviceId?: string;

  @property() public script = false;

  @property() public automations: T[] = [];

  @state() public _showSecondary = false;

  protected headerKey = "";

  protected type = "";

  private _localizeDeviceAutomation: (
    hass: HomeAssistant,
    automation: T
  ) => string;

  constructor(
    localizeDeviceAutomation: HaDeviceAutomationCard<T>["_localizeDeviceAutomation"]
  ) {
    super();
    this._localizeDeviceAutomation = localizeDeviceAutomation;
  }

  protected shouldUpdate(changedProps): boolean {
    if (changedProps.has("deviceId") || changedProps.has("automations")) {
      return true;
    }
    const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
    if (!oldHass || oldHass.language !== this.hass.language) {
      return true;
    }
    return false;
  }

  protected render(): TemplateResult {
    if (this.automations.length === 0) {
      return html``;
    }
    const automations = this._showSecondary
      ? this.automations
      : this.automations.filter(
          (automation) => automation.metadata?.secondary === false
        );
    return html`
      <h3>${this.hass.localize(this.headerKey)}</h3>
      <div class="content">
        <ha-chip-set>
          ${automations.map(
            (automation, idx) =>
              html`
                <ha-chip
                  .index=${idx}
                  @click=${this._handleAutomationClicked}
                  class=${automation.metadata?.secondary ? "secondary" : ""}
                >
                  ${this._localizeDeviceAutomation(this.hass, automation)}
                </ha-chip>
              `
          )}
        </ha-chip-set>
        ${!this._showSecondary && automations.length < this.automations.length
          ? html`<button class="link" @click=${this._toggleSecondary}>
              Show ${this.automations.length - automations.length} more...
            </button>`
          : ""}
      </div>
    `;
  }

  private _toggleSecondary() {
    this._showSecondary = !this._showSecondary;
  }

  private _handleAutomationClicked(ev: CustomEvent) {
    const automation = { ...this.automations[(ev.currentTarget as any).index] };
    if (!automation) {
      return;
    }
    delete automation.metadata;
    if (this.script) {
      showScriptEditor({ sequence: [automation as DeviceAction] });
      fireEvent(this, "entry-selected");
      return;
    }
    const data = {};
    data[this.type] = [automation];
    showAutomationEditor(data);
    fireEvent(this, "entry-selected");
  }

  static styles = [
    buttonLinkStyle,
    css`
      h3 {
        color: var(--primary-text-color);
      }
      .secondary {
        --ha-chip-background-color: rgba(var(--rgb-primary-text-color), 0.07);
      }
      button.link {
        color: var(--primary-color);
      }
    `,
  ];
}
