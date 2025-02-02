import { mdiFolderEdit } from "@mdi/js";
import "@material/mwc-button";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators";
import { MediaPlayerItem } from "../../data/media-player";
import "../ha-svg-icon";
import { isLocalMediaSourceContentId } from "../../data/media_source";
import type { HomeAssistant } from "../../types";
import { showMediaManageDialog } from "./show-media-manage-dialog";
import { fireEvent } from "../../common/dom/fire_event";

declare global {
  interface HASSDomEvents {
    "media-refresh": unknown;
  }
}

@customElement("ha-media-manage-button")
class MediaManageButton extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() currentItem?: MediaPlayerItem;

  @state() _uploading = 0;

  protected render(): TemplateResult {
    if (
      !this.currentItem ||
      !isLocalMediaSourceContentId(this.currentItem.media_content_id || "")
    ) {
      return html``;
    }
    return html`
      <mwc-button
        .label=${this.hass.localize(
          "ui.components.media-browser.file_management.manage"
        )}
        @click=${this._manage}
      >
        <ha-svg-icon .path=${mdiFolderEdit} slot="icon"></ha-svg-icon>
      </mwc-button>
    `;
  }

  private _manage() {
    showMediaManageDialog(this, {
      currentItem: this.currentItem!,
      onClose: () => fireEvent(this, "media-refresh"),
    });
  }

  static styles = css`
    mwc-button {
      /* We use icon + text to show disabled state */
      --mdc-button-disabled-ink-color: --mdc-theme-primary;
    }

    ha-svg-icon[slot="icon"],
    ha-circular-progress[slot="icon"] {
      vertical-align: middle;
    }

    :host-context([style*="direction: rtl;"]) ha-svg-icon[slot="icon"] {
      margin-left: 8px;
      margin-right: 0px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-media-manage-button": MediaManageButton;
  }
}
