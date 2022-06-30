import {Component, OnInit} from '@angular/core';
import 'grapesjs/dist/css/grapes.min.css';
// @ts-ignore
import grapesjs from "grapesjs";
// @ts-ignore
import grapesjsPresetNewsletter from "grapesjs-preset-newsletter";
// @ts-ignore
import fr from 'grapesjs/locale/fr';
import {SignatureService} from "../../service/signature.service";
import {Signature} from "../../model/signature";
import {ActivatedRoute, Params} from "@angular/router";
import {SubSink} from "subsink";
import {NotificationService} from "../../service/notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationType} from "../../enum/notification-type.enum";
import {User} from "../../model/user";
import {AuthenticationService} from "../../service/authentication.service";
import {SignatureVersion} from "../../model/signatureVersion";

@Component({
  selector: 'app-signature-builder',
  templateUrl: './signature-builder.component.html',
  styleUrls: ['./signature-builder.component.scss']
})
export class SignatureBuilderComponent implements OnInit {

  private editSignatureVersion = new SignatureVersion();
  private currentSignatureId = '';
  loggedInUser = new User();
  editor: any;
  loadedHtml = '';
  private subscriptions = new SubSink();

  constructor(private route: ActivatedRoute,
              private authService: AuthenticationService,
              private signatureService: SignatureService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUserFromLocalStorage();
    this.subscriptions.add(
      this.route.params.subscribe(
        (response: Params) => {
          this.currentSignatureId = response['signatureVersionId'];
        }
      ),
      this.signatureService.getSignatureVersionById(this.currentSignatureId).subscribe(
        (response: SignatureVersion) => {
          this.editSignatureVersion = response;
          this.loadedHtml = response.htmlSignature;
          this.uniSignBuilderInit();
        }
      )
    );
  }

  public onSaveInlineHtml() {
    this.editSignatureVersion.htmlSignature = this.editor.runCommand('gjs-get-inlined-html');
    const formData = this.signatureService.createSignatureVersionFormData(this.loggedInUser.username, this.editSignatureVersion);
    this.subscriptions.add(
      this.signatureService.updateSignature(formData).subscribe(
        (response: Signature) => {
          this.sendNotification(NotificationType.SUCCESS, `${response.label} updated with success`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )
  }

  /**
   * Calls Notification Service to notify in this component
   * @param notificationType NotificationType: notification type (e.g: ERROR, SUCCESS...)
   * @param message string: Message to show in the notification
   * @private
   */
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  private uniSignBuilderInit() {
    const LandingPage = {
      html: this.loadedHtml,
      css: null,
      components: null,
      style: null,
    };
    this.editor = grapesjs.init({
      // Indicate where to init the editor. You can also pass an HTMLElement
      container: '#gjs',
      i18n: {
        locale: 'fr', // default locale
        // detectLocale: true, // by default, the editor will detect the language
        // localeFallback: 'en', // default fallback
        messages: { fr },
      },
      plugins: [grapesjsPresetNewsletter],
      pluginsOpts: {
        'gjs-preset-newsletter': {
          modalTitleImport: 'Import template',
          // ... other options
        }
      },
      // Get the content for the canvas directly from the element
      // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
      components: LandingPage.html,
      fromElement: false,
      // Size of the editor
      height: '100%',
      width: 'auto',
      storageManager: {
        type: 'remote',
        stepsBeforeSave: 6,
        contentTypeJson: true,
        storeComponents: true,
        storeStyles: true,
        storeHtml: true,
        storeCss: true,
        urlStore: 'http://endpoint/store-template/some-id-123',
        urlLoad: 'http://localhost:8081/api/v1/signature/find/' + this.currentSignatureId,
        // For custom parameters/headers on requests
        params: { _some_token: '....' },
        headers: { Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJTaWduYXR1cmUgbWFuYWdlbWVudCBwb3J0YWwiLCJzdWIiOiJkUHVhdWQiLCJpc3MiOiJLb25pY2EgTWlub2x0YSBDZW50cmUgTG9pcmUsIFNBUyIsIkF1dGhvcml0aWVzIjpbInVzZXI6cmVhZCIsInVzZXI6dXBkYXRlIiwidXNlcjpjcmVhdGUiLCJ1c2VyOmRlbGV0ZSJdLCJleHAiOjE2NDY0Njc4NDMsImlhdCI6MTY0NjAzNTg0M30.y6KLIih-Ap51K7HCD9KnzA9UnWQib1Z4R5M5lwtUvfYxQ0PHfw1I2oYTz6GIfRWI1uNgbRRUF4jFzaNJ3mtZUQ' },
      },
      layerManager: {
        appendTo: '.layers-container'
      },
      // Avoid any default panel
      panels: {
        defaults: [
          {
            id: 'layers',
            el: '.panel__right',
            // Make the panel resizable
            resizable: {
              maxDim: 350,
              minDim: 200,
              tc: 0, // Top handler
              cl: 1, // Left handler
              cr: 0, // Right handler
              bc: 0, // Bottom handler
              // Being a flex child we need to change `flex-basis` property
              // instead of the `width` (default)
              keyWidth: 'flex-basis',
            },
          },
          {
            id: 'panel-switcher',
            el: '.panel__switcher',
            buttons: [
              {
                id: 'show-blocks',
                active: true,
                label: '<i class="fa fa-object-group"></i>',
                command: 'show-blocks',
                // Once activated disable the possibility to turn it off
                togglable: false,
              },
              {
                id: 'show-traits',
                active: true,
                label: '<i class="fa fa-cog"></i>',
                command: 'show-traits',
                togglable: false,
              },
              {
                id: 'show-layers',
                active: true,
                label: '<i class="fa fa-th-list"></i>',
                command: 'show-layers',
                // Once activated disable the possibility to turn it off
                togglable: false,
              },
              {
                id: 'show-style',
                active: true,
                label: '<i class="fa fa-paint-brush"></i>',
                command: 'show-styles',
                togglable: false,
              },
            ],
          }
        ]
      },
      traitManager: {
        appendTo: '.traits-container',
      },
      selectorManager: {
        appendTo: '.styles-container'
      },
      styleManager: {
        appendTo: '.styles-container',
        sectors: [{
          name: 'Dimension',
          open: false,
          // Use built-in properties
          buildProps: ['width', 'min-height', 'padding'],
          // Use `properties` to define/override single property
          properties: [
            {
              // Type of the input,
              // options: integer | radio | select | color | slider | file | composite | stack
              type: 'integer',
              name: 'The width', // Label for the property
              property: 'width', // CSS property (if buildProps contains it will be extended)
              units: ['px', '%'], // Units, available only for 'integer' types
              defaults: 'auto', // Default value
              min: 0, // Min value, available only for 'integer' types
            }
          ]
        },
          {
            name: 'Extra',
            open: false,
            buildProps: ['background-color', 'box-shadow', 'custom-prop'],
            properties: [
              {
                id: 'custom-prop',
                name: 'Custom Label',
                property: 'font-size',
                type: 'select',
                defaults: '32px',
                // List of options, available only for 'select' and 'radio'  types
                options: [
                  {value: '12px', name: 'Tiny'},
                  {value: '18px', name: 'Medium'},
                  {value: '32px', name: 'Big'},
                ],
              }
            ]
          }]
      },
      blockManager: {
        appendTo: '.blocks-container',
        blocks: [
          //   {
          //     id: 'section', // id is mandatory
          //     label: '<b>Section</b>', // You can use HTML/SVG inside labels
          //     attributes: { class:'gjs-block-section' },
          //     content: `<section>
          //   <h1>This is a simple title</h1>
          //   <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
          // </section>`,
          //   }, {
          //     id: 'text',
          //     label: 'Text',
          //     content: '<div data-gjs-type="text">Insert your text here</div>',
          //   }, {
          //     id: 'image',
          //     label: 'Image',
          //     // Select the component once it's dropped
          //     select: true,
          //     // You can pass components as a JSON instead of a simple HTML string,
          //     // in this case we also use a defined component type `image`
          //     content: { type: 'image' },
          //     // This triggers `active` event on dropped components and the `image`
          //     // reacts by opening the AssetManager
          //     activate: true,
          //   }
        ]
      },
    });
    /**
     * Add Basic Options to Top Panel
     */
    this.editor.Panels.addPanel({
      id: 'panel-top',
      el: '.panel__top',
    });
    this.editor.Panels.addPanel({
      id: 'basic-actions',
      el: '.panel__basic-actions',
      buttons: [
        {
          id: 'visibility',
          active: true, // active by default
          className: 'btn-toggle-borders',
          label: '<i class="fa fa-eye-slash" aria-hidden="true"></i>',
          command: 'sw-visibility', // Built-in command
        },
        {
          id: 'export',
          className: 'btn-open-export',
          label: '<i class="fa fa-code"></i>',
          command: 'export-template',
          context: 'export-template', // For grouping context of buttons from the same panel
        }
      ],
    });
    // Add Buttons
    // Add undo/redo buttons
    this.editor.Panels.addButton('options', {
      id: 'undo',
      className: 'fa fa-undo',
      command: 'undo',
      attributes: { title: 'Undo' }
    });
    this.editor.Panels.addButton('options', {
      id: 'redo',
      className: 'fa fa-repeat',
      command: 'redo',
      attributes: { title: 'Redo' }
    });
    // Define commands
    this.editor.Commands.add('show-blocks', {
      getRowEl(editor: any) {
        return editor.getContainer().closest('.editor-row');
      },
      getStyleEl(row: any) {
        return row.querySelector('.blocks-container')
      },

      run(editor: any) {
        const bmEl = this.getStyleEl(this.getRowEl(editor));
        bmEl.style.display = '';
      },
      stop(editor: any) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = 'none';
      },
    });
    this.editor.Commands.add('show-traits', {
      getRowEl(editor: any) {
        return editor.getContainer().closest('.editor-row');
      },
      getLayersEl(row: any) {
        return row.querySelector('.traits-container')
      },

      run(editor: any) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = '';
      },
      stop(editor: any) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = 'none';
      },
    });
    this.editor.Commands.add('show-layers', {
      getRowEl(editor: any) {
        return editor.getContainer().closest('.editor-row');
      },
      getLayersEl(row: any) {
        return row.querySelector('.layers-container')
      },

      run(editor: any) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = '';
      },
      stop(editor: any) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = 'none';
      },
    });
    this.editor.Commands.add('show-styles', {
      getRowEl(editor: any) {
        return editor.getContainer().closest('.editor-row');
      },
      getStyleEl(row: any) {
        return row.querySelector('.styles-container')
      },

      run(editor: any) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = '';
      },
      stop(editor: any) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = 'none';
      },
    });
    // Custom Components style
    let bm = this.editor.BlockManager;
    bm.get('button').set({
      content: {
        type: 'link',
        content: '<a class="button">Button</a>',
        style: { padding: '10px 20px',' background-color': '#006fb9', color: 'white', 'text-align': 'center' }
      },
      attributes: {class:'gjs-fonts gjs-f-button'}
    });
    const blockFirstName = bm.add('FIRST-NAME', {
      // Your block properties...
      type: 'span',
      label: 'First Name',
      content: '<span id="firstName44">#FIRST_NAME#</span> ',
      attributes: {class:'gjs-fonts gjs-f-text'}
    });
    const blockLastName = bm.add('LAST-NAME', {
      // Your block properties...
      type: 'span',
      label: 'Last Name',
      content: '<span id="lastName44">#LAST_NAME#</span> ',
      attributes: {class:'gjs-fonts gjs-f-text'}
    });
    const blockAgency = bm.add('AGENCY', {
      // Your block properties...
      type: 'span',
      label: 'Agency',
      content: '<span id="agency44">#AGENCY#</span> ',
      attributes: {class:'gjs-fonts gjs-f-text'}
    });
    const blockPosition = bm.add('JOB', {
      // Your block properties...
      type: 'span',
      label: 'Job position',
      content: '<span id="agency44">#POSITION#</span> ',
      attributes: {class:'gjs-fonts gjs-f-text'}
    });
    const blockPhone = bm.add('PHONE', {
      // Your block properties...
      type: 'span',
      label: 'Phone Number',
      content: '<span id="phoneNum44">#00.00.00.00.00#</span>',
      attributes: {class:'gjs-fonts gjs-f-text'}
    });
    const blockEvent = bm.add('EVENT-MSG', {
      // Your block properties...
      label: 'Event Message',
      content: '<span id="event44">#EVENT_MESSAGE#</span>',
      attributes: {class:'gjs-fonts gjs-f-text'}
    });


  }
}
