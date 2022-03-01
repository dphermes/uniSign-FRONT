import {Component, OnInit} from '@angular/core';
import 'grapesjs/dist/css/grapes.min.css';
// @ts-ignore
import grapesjs from "grapesjs";
// @ts-ignore
import grapesjsPresetNewsletter from "grapesjs-preset-newsletter";
// @ts-ignore
import fr from 'grapesjs/locale/fr';

@Component({
  selector: 'app-signature-builder',
  templateUrl: './signature-builder.component.html',
  styleUrls: ['./signature-builder.component.scss']
})
export class SignatureBuilderComponent implements OnInit {

  editor: any;
  loadedHtml = '';

  constructor() {
  }

  ngOnInit(): void {
    this.loadedHtml = '<h1>sdlfgjldfkjg</h1>';
    this.uniSignBuilderInit();
  }

  private saveInlineHtml(htmlToSave: string) {
    console.log(htmlToSave);
  }

  private uniSignBuilderInit() {
    this.editor = grapesjs.init({
      // Indicate where to init the editor. You can also pass an HTMLElement
      container: '#gjs',
      i18n: {
        locale: 'fr', // default locale
        // detectLocale: true, // by default, the editor will detect the language
        // localeFallback: 'en', // default fallback
        messages: { fr },
      },
      components: this.loadedHtml,
      plugins: [grapesjsPresetNewsletter],
      pluginsOpts: {
        'gjs-preset-newsletter': {
          modalTitleImport: 'Import template',
          // ... other options
        },
        "gjs-blocks-basic": {
          /* ...options */
        }
      },
      // Get the content for the canvas directly from the element
      // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
      fromElement: true,
      // Size of the editor
      height: '100%',
      width: 'auto',
      // Disable the storage manager for the moment
      storageManager: false,
      layerManager: {
        appendTo: '.layers-container'
      },
      deviceManager: {
        appendTo: '.blocks-container',
        devices: [
          {
            name: 'Desktop',
            width: '', // default size
          },
          {
            name: 'Tablet',
            width: '680px', // this value will be used on canvas width
            widthMedia: '740px', // this value will be used in CSS @media
          },
          {
            name: 'Mobile',
            width: '320px', // this value will be used on canvas width
            widthMedia: '480px', // this value will be used in CSS @media
          }
        ]
      },
      // Avoid any default panel
      panels: {
        defaults: [
          {
            id: 'basic-custom-options',
            el: '.panel__basic-custom-options',
            buttons: [
              {
                id: 'save',
                className: 'btn-save-data',
                label: '<i class="fa fa-save"></i> <span class="small">SAVE</span>',
                command: 'save-data',
                context: 'save-data', // For grouping context of buttons from the same panel
              }
            ]
          },
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
                id: 'show-layers',
                active: true,
                label: '<i class="fa fa-layer-group"></i>',
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
              {
                id: 'panel-devices',
                el: '.panel__devices',
                buttons: [
                  {
                    id: 'device-desktop',
                    label: 'D',
                    command: 'set-device-desktop',
                    active: true,
                    togglable: false,
                  },
                  {
                    id: 'device-tablet',
                    label: 'T',
                    command: 'set-device-tablet',
                    active: true,
                    togglable: false,
                  },
                  {
                    id: 'device-mobile',
                    label: 'M',
                    command: 'set-device-mobile',
                    togglable: false,
                  }
                ],
              }
            ],
          }
        ]
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
        },
        {
          id: 'show-json',
          className: 'btn-show-json',
          label: 'JSON',
          context: 'show-json',
          command(editor: any) {
            editor.Modal.setTitle('Components JSON')
              .setContent(`<textarea style="width:100%; height: 250px;">
            ${JSON.stringify(editor.getComponents())}
          </textarea>`)
              .open();
          },
        }
      ],
    });
    // Define commands
    this.editor.Commands.add('save-data', {
      run(editor: any) {
        const inlineHtml: string = editor.runCommand('gjs-get-inlined-html');
        console.log(inlineHtml);
      }
    });
    this.editor.Commands.add('set-device-desktop', {
      run: (editor: { setDevice: (arg0: string) => any; }) => editor.setDevice('Desktop')
    });
    this.editor.Commands.add('set-device-tablet', {
      run: (editor: { setDevice: (arg0: string) => any; }) => editor.setDevice('Tablet')
    });
    this.editor.Commands.add('set-device-mobile', {
      run: (editor: { setDevice: (arg0: string) => any; }) => editor.setDevice('Mobile')
    });
    this.editor.Commands.add('show-blocks', {
      getRowEl(editor: any) {
        return editor.getContainer().closest('.editor-row');
      },
      getStyleEl(row: any) {
        return row.querySelector('.blocks-container')
      },

      run(editor: any, sender: any) {
        const bmEl = this.getStyleEl(this.getRowEl(editor));
        bmEl.style.display = '';
      },
      stop(editor: any, sender: any) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = 'none';
      },
    });
    this.editor.Commands.add('show-layers', {
      getRowEl(editor: any) {
        return editor.getContainer().closest('.editor-row');
      },
      getLayersEl(row: any) {
        return row.querySelector('.layers-container')
      },

      run(editor: any, sender: any) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = '';
      },
      stop(editor: any, sender: any) {
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

      run(editor: any, sender: any) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = '';
      },
      stop(editor: any, sender: any) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = 'none';
      },
    });
  }
}
