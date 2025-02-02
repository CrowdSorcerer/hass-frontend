import { dump } from "js-yaml";
import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import "../../../../src/components/ha-card";
import { describeAction } from "../../../../src/data/script_i18n";
import { getEntity } from "../../../../src/fake_data/entity";
import { provideHass } from "../../../../src/fake_data/provide_hass";
import { HomeAssistant } from "../../../../src/types";

const ENTITIES = [
  getEntity("scene", "kitchen_morning", "scening", {
    friendly_name: "Kitchen Morning",
  }),
  getEntity("media_player", "kitchen", "playing", {
    friendly_name: "Sonos Kitchen",
  }),
];

const ACTIONS = [
  { wait_template: "{{ true }}", alias: "Something with an alias" },
  { delay: "0:05" },
  { wait_template: "{{ true }}" },
  {
    condition: "template",
    value_template: "{{ true }}",
  },
  { event: "happy_event" },
  {
    device_id: "abcdefgh",
    domain: "plex",
    entity_id: "media_player.kitchen",
    type: "turn_on",
  },
  { scene: "scene.kitchen_morning" },
  {
    service: "scene.turn_on",
    target: { entity_id: "scene.kitchen_morning" },
    metadata: {},
  },
  {
    service: "media_player.play_media",
    target: { entity_id: "media_player.kitchen" },
    data: { media_content_id: "", media_content_type: "" },
    metadata: { title: "Happy Song" },
  },
  {
    wait_for_trigger: [
      {
        platform: "state",
        entity_id: "input_boolean.toggle_1",
      },
    ],
  },
  {
    variables: {
      hello: "world",
    },
  },
  {
    service: "input_boolean.toggle",
    target: {
      entity_id: "input_boolean.toggle_4",
    },
  },
  {
    parallel: [
      { scene: "scene.kitchen_morning" },
      {
        service: "media_player.play_media",
        target: { entity_id: "media_player.living_room" },
        data: { media_content_id: "", media_content_type: "" },
        metadata: { title: "Happy Song" },
      },
    ],
  },
  {
    stop: "No one is home!",
  },
  { repeat: { count: 3, sequence: [{ delay: "00:00:01" }] } },
  {
    if: [{ condition: "state" }],
    then: [{ delay: "00:00:01" }],
  },
];

@customElement("demo-automation-describe-action")
export class DemoAutomationDescribeAction extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;

  protected render(): TemplateResult {
    if (!this.hass) {
      return html``;
    }
    return html`
      <ha-card header="Actions">
        ${ACTIONS.map(
          (conf) => html`
            <div class="action">
              <span>${describeAction(this.hass, conf as any)}</span>
              <pre>${dump(conf)}</pre>
            </div>
          `
        )}
      </ha-card>
    `;
  }

  protected firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    const hass = provideHass(this);
    hass.updateTranslations(null, "en");
    hass.addEntities(ENTITIES);
  }

  static get styles() {
    return css`
      ha-card {
        max-width: 600px;
        margin: 24px auto;
      }
      .action {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      span {
        margin-right: 16px;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "demo-automation-describe-action": DemoAutomationDescribeAction;
  }
}
