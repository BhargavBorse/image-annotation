import {
  style
} from '@angular/animations';
import {
  CONTEXT_NAME
} from '@angular/compiler/src/render3/view/util';
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import {
  fabric
} from 'fabric';
import {
  Object
} from 'fabric/fabric-impl';

@Component({
  selector: 'angular-editor-fabric-js',
  templateUrl: './angular-editor-fabric-js.component.html',
  styleUrls: ['./angular-editor-fabric-js.component.css'],
})

export class FabricjsEditorComponent implements AfterViewInit {
  @ViewChild('htmlCanvas') htmlCanvas: ElementRef;

  private canvas: fabric.Canvas;
  public props = {
    canvasFill: '#ffffff',
    canvasImage: '',
    id: null,
    opacity: null,
    fill: null,
    backgroundColor: null,
    borderColor: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: '',
    drawMode: true,
  };

  public textString: string;
  public url: string | ArrayBuffer = '';
  public urlBack: string | ArrayBuffer = '';
  public size: any = {
    width: 1450,
    height: 700,
  };

  public json: any;
  public xml: any;
  public xmlData: any;
  private globalEditor = false;
  public textEditor = false;
  private imageEditor = false;
  public figureEditor = false;
  public selected: any;

  constructor() { }

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas('canvas', {
      hoverCursor: 'pointer',
      selection: false,
      selectionBorderColor: 'blue',
      backgroundColor: 'white',
    });

    this.canvas.on({
      'object:moving': (e) => { },
      'object:modified': (e) => { },
      'object:selected': (e) => {

        const selectedObject = e.target;
        this.selected = selectedObject;
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';

        this.resetPanels();

        if (selectedObject.type !== 'group' && selectedObject) {

          this.getId();
          this.getOpacity();

          switch (selectedObject.type) {
            case 'rect':
            case 'circle':
            case 'i-text':
              this.textEditor = true;
              this.getLineHeight();
              this.getCharSpacing();
              this.getBold();
              this.getFill();
              this.getTextDecoration();
              this.getTextAlign();
              this.getFontFamily();
              break;
            case 'image':
              break;
          }
        }
      },
      'selection:cleared': (e) => {
        this.selected = null;
        this.resetPanels();
      }
    });

    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);

    this.canvas.on('mouse:down', (e) => {
      const canvasElement: any = document.getElementById('canvas');
    });

  }
  UploadImg() {

  }

  changeSize() {
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
  }

  addText() {
    if (this.textString) {
      const text = new fabric.IText(this.textString, {
        left: 10,
        top: 10,
        fontFamily: 'helvetica',
        angle: 0,
        fill: '#000000',
        scaleX: 0.5,
        scaleY: 0.5,
        fontWeight: '',
        hasRotatingPoint: true
      });

      this.extend(text, this.randomId());
      this.canvas.add(text);
      this.selectItemAfterAdded(text);
      this.textString = '';
    }
  }

  getImgPolaroid(event: any) {
    const el = event.target;
    fabric.loadSVGFromURL(el.src, (objects, options) => {
      const image = fabric.util.groupSVGElements(objects, options);
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornerSize: 10,
        hasRotatingPoint: true,
      });
      this.extend(image, this.randomId());
      this.canvas.add(image);
      this.selectItemAfterAdded(image);
    });
  }

  addImageOnCanvas(url, renderInBack) {
    if (!renderInBack) {
      if (url) {
        fabric.Image.fromURL(url, (image) => {
          image.set({
            left: 10,
            top: 10,
            angle: 0,
            padding: 10,
            cornerSize: 10,
            hasRotatingPoint: true
          });
          image.scaleToWidth(200);
          image.scaleToHeight(200);
          this.extend(image, this.randomId());
          this.canvas.add(image);
          this.selectItemAfterAdded(image);
        });
      }
    } else {
      fabric.Image.fromURL(url, (image) => {

        this.canvas.setBackgroundImage(image, this.canvas.renderAll.bind(this.canvas), {
          // scaleX: canvas.width / img.width,
          // scaleY: canvas.height / img.height           
        });
        this.canvas.setWidth(image.getScaledWidth());
        this.canvas.setHeight(image.getScaledHeight());
        this.canvas.renderAll();
      });
    }
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        this.url = readerEvent.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url) {
    this.url = '';
  }

  addFigure(figure) {
    let add: any;
    switch (figure) {
      case 'rectangle':
        add = new fabric.Rect({
          width: 200,
          height: 100,
          left: 100,
          top: 100,
          angle: 0,
          fill: '#3f51b5',
          opacity: 0.5,
          rx: 1
        });
        break;
      case 'circle':
        add = new fabric.Circle({
          radius: 50,
          left: 10,
          top: 10,
          fill: '#ff5722',
          opacity: 0.5,
          skewX: 1,
        });
        break;
      case 'ellipse':
        add = new fabric.Circle({
          radius: 50,
          left: 10,
          top: 10,
          fill: '',
          stroke: '#ff0000',
          opacity: 0.5
        });
        break;
      case 'rect':
        add = new fabric.Rect({
          width: 200,
          height: 100,
          left: 100,
          top: 100,
          angle: 0,
          stroke: '#ff0000',
          // strokeWidth: 2,
          fill: '',
          opacity: 0.5
        });
        break;
    }
    this.extend(add, this.randomId());
    this.canvas.add(add);
    this.selectItemAfterAdded(add);
  }

  cleanSelect() {
    this.canvas.discardActiveObject().renderAll();
  }

  selectItemAfterAdded(obj) {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
  }

  setCanvasFill() {
    if (!this.props.canvasImage) {
      this.canvas.backgroundColor = this.props.canvasFill;
      this.canvas.renderAll();
    }
  }

  extend(obj, id) {
    obj.toObject = ((toObject) => {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id
        });
      };
    })(obj.toObject);
  }

  setCanvasImage() {
    const self = this;
    if (this.props.canvasImage) {
      this.canvas.setBackgroundColor(new fabric.Pattern({
        source: this.props.canvasImage,
        repeat: 'repeat'
      }), () => {
        self.props.canvasFill = '';
        self.canvas.renderAll();
      });
    }
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  getActiveStyle(styleName, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) {
      return '';
    }

    if (object.getSelectionStyles && object.isEditing) {
      return (object.getSelectionStyles()[styleName] || '');
    } else {
      return (object[styleName] || '');
    }
  }

  setActiveStyle(styleName, value: string | number, object: fabric.IText) {
    object = object || this.canvas.getActiveObject() as fabric.IText;
    if (!object) {
      return;
    }

    if (object.setSelectionStyles && object.isEditing) {
      const style = {};
      style[styleName] = value;

      if (typeof value === 'string') {
        if (value.includes('underline')) {
          object.setSelectionStyles({
            underline: true
          });
        } else {
          object.setSelectionStyles({
            underline: false
          });
        }

        if (value.includes('overline')) {
          object.setSelectionStyles({
            overline: true
          });
        } else {
          object.setSelectionStyles({
            overline: false
          });
        }

        if (value.includes('line-through')) {
          object.setSelectionStyles({
            linethrough: true
          });
        } else {
          object.setSelectionStyles({
            linethrough: false
          });
        }
      }

      object.setSelectionStyles(style);
      object.setCoords();

    } else {
      if (typeof value === 'string') {
        if (value.includes('underline')) {
          object.set('underline', true);
        } else {
          object.set('underline', false);
        }

        if (value.includes('overline')) {
          object.set('overline', true);
        } else {
          object.set('overline', false);
        }

        if (value.includes('line-through')) {
          object.set('linethrough', true);
        } else {
          object.set('linethrough', false);
        }
      }

      object.set(styleName, value);
    }

    object.setCoords();
    this.canvas.renderAll();
  }

  getActiveProp(name) {
    const object = this.canvas.getActiveObject();
    if (!object) {
      return '';
    }

    return object[name] || '';
  }

  setActiveProp(name, value) {
    const object = this.canvas.getActiveObject();
    if (!object) {
      return;
    }
    object.set(name, value).setCoords();
    this.canvas.renderAll();
  }

  clone() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      let clone;
      switch (activeObject.type) {
        case 'rect':
          clone = new fabric.Rect(activeObject.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(activeObject.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', activeObject.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(activeObject);
          break;
      }
      if (clone) {
        clone.set({
          left: 10,
          top: 10
        });
        this.canvas.add(clone);
        this.selectItemAfterAdded(clone);
      }
    }
  }

  getId() {
    this.props.id = this.canvas.getActiveObject().toObject().id;
  }

  setId() {
    const val = this.props.id;
    const complete = this.canvas.getActiveObject().toObject();
    console.log(complete);
    this.canvas.getActiveObject().toObject = () => {
      complete.id = val;
      return complete;
    };
  }

  getOpacity() {
    this.props.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  setOpacity() {
    this.setActiveStyle('opacity', parseInt(this.props.opacity, 10) / 100, null);
  }

  getFill() {
    this.props.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.setActiveStyle('fill', this.props.fill, null);
  }

  getBorderFill() {
    this.props.borderColor = this.getActiveStyle('stroke', null);
  }

  setBorderFill() {
    this.setActiveStyle('stroke', this.props.borderColor, null);
  }

  setBgFill() {
    this.setActiveStyle('backgroundColor', this.props.backgroundColor, null);
  }

  getBgFill() {
    this.props.backgroundColor = this.getActiveStyle('backgroundColor', null);
  }

  getLineHeight() {
    this.props.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
  }

  getCharSpacing() {
    this.props.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.setActiveStyle('charSpacing', this.props.charSpacing, null);
  }

  getFontSize() {
    this.props.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.setActiveStyle('fontSize', parseInt(this.props.fontSize, 10), null);
  }

  getBold() {
    this.props.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.props.fontWeight = !this.props.fontWeight;
    this.setActiveStyle('fontWeight', this.props.fontWeight ? 'bold' : '', null);
  }

  setFontStyle() {
    this.props.fontStyle = !this.props.fontStyle;
    if (this.props.fontStyle) {
      this.setActiveStyle('fontStyle', 'italic', null);
    } else {
      this.setActiveStyle('fontStyle', 'normal', null);
    }
  }

  getTextDecoration() {
    this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
  }

  setTextDecoration(value) {
    let iclass = this.props.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, 'g'), '');
    } else {
      iclass += ` ${value}`;
    }
    this.props.TextDecoration = iclass;
    this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
  }

  hasTextDecoration(value) {
    return this.props.TextDecoration.includes(value);
  }

  getTextAlign() {
    this.props.textAlign = this.getActiveProp('textAlign');
  }

  setTextAlign(value) {
    this.props.textAlign = value;
    this.setActiveProp('textAlign', this.props.textAlign);
  }

  getFontFamily() {
    this.props.fontFamily = this.getActiveProp('fontFamily');
  }

  setFontFamily() {
    this.setActiveProp('fontFamily', this.props.fontFamily);
  }

  removeSelected() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      this.canvas.remove(activeObject);

    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      const self = this;
      activeGroup.forEach((object) => {
        self.canvas.remove(object);
      });
    }
  }

  canvasRead() {
    this.canvas.forEachObject((object) => {
      this.canvas.isDrawingMode = false;
      object.selectable = false;
    });

    let button = document.getElementsByTagName('button');
    for (let i = 0; i < button.length; i++) {
      button[i].style.display = 'none';
    }

    let unlockButton = document.getElementById('canvasWrite');
    unlockButton.style.display = 'inline';

    let lockButton = document.getElementById('canvasRead');
    lockButton.style.display = 'none';
  }

  canvasWrite() {
    this.canvas.forEachObject((object) => {
      object.selectable = true;
    });

    let button = document.getElementsByTagName('button');
    for (let i = 0; i < button.length; i++) {
      button[i].style.display = 'inline';
    }

    let unlockButton = document.getElementById('canvasWrite');
    unlockButton.style.display = 'none';

    let lockButton = document.getElementById('canvasRead');
    lockButton.style.display = 'inline';
  }

  zoomInCanvas() {
    this.canvas.setZoom(this.canvas.getZoom() * 1.1);
    this.canvas.setHeight(this.canvas.getHeight() * 1.1);
    this.canvas.setWidth(this.canvas.getWidth() * 1.1);
  }

  zoomOutCanvas() {
    this.canvas.setZoom(this.canvas.getZoom() / 1.1);
    this.canvas.setHeight(this.canvas.getHeight() / 1.1);
    this.canvas.setWidth(this.canvas.getWidth() / 1.1);
  }

  freeDraw() {
    this.canvas.isDrawingMode = true;
  }

  moveSelectedObj() {
    this.canvas.isDrawingMode = false;
  }
  bringToFront() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      activeObject.bringToFront();
      activeObject.opacity = 0.5;
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      activeGroup.forEach((object) => {
        object.bringToFront();
      });
    }
  }

  sendToBack() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      this.canvas.sendToBack(activeObject);
      activeObject.sendToBack();
      activeObject.opacity = 0.5;
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      activeGroup.forEach((object) => {
        object.sendToBack();
      });
    }
  }

  confirmClear() {
    this.canvas.getObjects().forEach((o) => {
      if (o !== this.canvas.backgroundImage) {
        this.canvas.remove(o)
      }
    })
  }

  rasterize() {
    const image = new Image();
    image.src = this.canvas.toDataURL({
      format: 'png'
    });
    const w = window.open('');
    w.document.write(image.outerHTML);
  }

  rasterizeSVG() {
    const w = window.open('');
    w.document.write(this.canvas.toSVG());
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(this.canvas.toSVG());
  }

  rasterizeJSON() {
    this.json = JSON.stringify(this.canvas, null, 2);
  }

  readJson(event) {
    if (event.target.files.length !== 1) {
      console.error('No file selected');
    } else if (event.target.files[0].type == 'application/json') {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const textJson = reader.result.toString();
        this.canvas.loadFromJSON(textJson, () => {
          this.canvas.renderAll();
        });
      };
      reader.readAsText(event.target.files[0]);
    }
    else if (event.target.files[0].name.match(/.(xml)$/i)) {

      const reader = new FileReader();
      reader.onloadend = (e) => {
        const textJson = reader.result.toString();
        localStorage.setItem('xmlUpdated', textJson);

        const CANVAS = localStorage.getItem('xmlUpdated');
        var xmlDoc = (new DOMParser()).parseFromString(CANVAS, "text/xml");

        var items = xmlDoc.getElementsByTagName('Items')[1];
        var jsonDets = "";
        jsonDets = `{
          "version": "3.6.6",
          "objects": [
            `;

        let annotationNames: string[] = ['RectangleData'];

        for (var i = 0; i < annotationNames.length; i++) {
          var annotations = xmlDoc.getElementsByTagName(annotationNames[i]);

          console.log('Found ' + annotations.length + ' ' + annotationNames[i])

          for (var a = 0; a < annotations.length; a++) {
            console.log('Processing ' + (i + 1) + ' of ' + annotations.length + ' ' + annotationNames[i])
            jsonDets += this.getJsonFromXml(annotations[a]);
          }
        }

        console.log('jsonDets', jsonDets);

        return;

        for (var i = 0; i < items.children.length; i++) {
          // if(i%2 == 0) {
          //   // console.log(items);
          //   continue;
          // }

          if (items.children[i].nodeName == 'RectangleData') {

            // var rectItem = items.childNodes[i];
            // console.log(rectItem.textContent);

            var rectData = items.getElementsByTagName('RectangleData')[i];
            // console.log(rectData.textContent);

            var rectLoc = rectData.getElementsByTagName('Location')[0].textContent;
            console.log("Rectangle: " + rectLoc);
            var rectLocArray = rectLoc.split(',');
            var rectLocX = rectLocArray[0];
            var rectLocY = rectLocArray[1];

            var rectSize = rectData.getElementsByTagName('Size')[0].textContent;
            var rectSizeArray = rectSize.split(',');
            let sizeX = parseInt(rectSizeArray[0]);
            let sizeY = parseInt(rectSizeArray[1]);
            let mergeY = sizeY / 100;
            let mergeX = sizeX / 200;

            var fillData = rectData.getElementsByTagName('Fill')[0];
            var fillColor = fillData.getElementsByTagName('Color')[0].firstChild.textContent;
            let fillCode = parseInt(fillColor, 10).toString(16).toUpperCase().substring(2);
            // console.log(fillCode);
            var outlineData = rectData.getElementsByTagName('Outline')[0];
            var outlineStroke = outlineData.getElementsByTagName('Color')[0].firstChild.textContent;
            let strokeCode = parseInt(outlineStroke, 10).toString(16).toUpperCase().substring(2);

            var rotationData = rectData.getElementsByTagName('Rotation')[0].firstChild.textContent;

            jsonDets += `{"type": "rect",
            "version": "3.6.6",
            "originX": "left",
            "originY": "top",
            "left": `+ rectLocX + `,
            "top": `+ rectLocY + `,
            "width": 200,
            "height": 100,
            "fill": "#`+ fillCode + `",
            "stroke": "#`+ strokeCode + `",
            "strokeWidth": 2,
            "strokeDashArray": null,
            "strokeLineCap": "butt",
            "strokeDashOffset": 0,
            "strokeLineJoin": "miter",
            "strokeMiterLimit": 4,
            "scaleX": `+ mergeX + `,
            "scaleY": `+ mergeY + `,
            "angle": `+ rotationData + `,
            "flipX": false,
            "flipY": false,
            "opacity": 0.5,
            "shadow": null,
            "visible": true,
            "clipTo": null,
            "backgroundColor": "",
            "fillRule": "nonzero",
            "paintFirst": "fill",
            "globalCompositeOperation": "source-over",
            "transformMatrix": null,
            "skewX": 0,
            "skewY": 0,
            "rx": 0,
            "ry": 0,
            "id": 808065
          },`;
          }
          else if (items.children[i].nodeName == 'EllipseData') {

            var ellipseData = items.getElementsByTagName('EllipseData')[0];
            var ellipseLoc = ellipseData.getElementsByTagName('Location')[0].textContent;
            console.log("Ellipse: " + ellipseLoc);
            var ellipseLocArray = ellipseLoc.split(',');
            var ellipseLocX = ellipseLocArray[0];
            var ellipseLocY = ellipseLocArray[1];

            var ellipseSize = ellipseData.getElementsByTagName('Size')[0].textContent;
            var ellipseSizeArray = ellipseSize.split(',');
            let sizeX = parseInt(ellipseSizeArray[0]);
            let sizeY = parseInt(ellipseSizeArray[1]);
            let mergeY = sizeY / 100;
            let mergeX = sizeX / 200;

            var fillData = ellipseData.getElementsByTagName('Fill')[0];
            var fillColor = fillData.getElementsByTagName('Color')[0].firstChild.textContent;
            let fillCode = parseInt(fillColor, 10).toString(16).toUpperCase().substring(2);

            var outlineData = ellipseData.getElementsByTagName('Outline')[0];
            var outlineStroke = outlineData.getElementsByTagName('Color')[0].firstChild.textContent;
            let strokeCode = parseInt(outlineStroke, 10).toString(16).toUpperCase().substring(2);

            jsonDets += `{
            "type": "circle",
            "version": "3.6.6",
            "originX": "left",
            "originY": "top",
            "left": `+ ellipseLocX + `,
            "top": `+ ellipseLocY + `,
            "width": 100,
            "height": 100,
            "fill": "#`+ fillCode + `",
            "stroke": "#`+ strokeCode + `",
            "strokeWidth": 1,
            "strokeDashArray": null,
            "strokeLineCap": "butt",
            "strokeDashOffset": 0,
            "strokeLineJoin": "miter",
            "strokeMiterLimit": 4,
            "scaleX": `+ mergeX + `,
            "scaleY": `+ mergeY + `,
            "angle": 0,
            "flipX": false,
            "flipY": false,
            "opacity": 0.5,
            "shadow": null,
            "visible": true,
            "clipTo": null,
            "backgroundColor": "",
            "fillRule": "nonzero",
            "paintFirst": "fill",
            "globalCompositeOperation": "source-over",
            "transformMatrix": null,
            "skewX": 0,
            "skewY": 0,
            "radius": 50,
            "startAngle": 0,
            "endAngle": 6.283185307179586,
            "id": 302050
          },`;
          }
          else if (items.children[i].nodeName == 'TextData') {
            var textDet = items.getElementsByTagName('TextData')[0];
            var fontDet = textDet.getElementsByTagName('Font')[0];
            var fontStyleDet = fontDet.getElementsByTagName('Italic')[0].innerHTML;
            var fontWeightDet = fontDet.getElementsByTagName('Bold')[0].innerHTML;

            if (fontWeightDet == "True" && fontStyleDet == "False") {

              var textData = items.getElementsByTagName('TextData')[0];
              var textLoc = textData.getElementsByTagName('Location')[0].textContent;
              console.log("Text: " + textLoc);
              var textLocArray = textLoc.split(',');
              var textLocX = textLocArray[0];
              var textLocY = textLocArray[1];

              var text = textData.getElementsByTagName('Text')[0].textContent;

              var fontData = textData.getElementsByTagName('Font')[0];
              var fontName = fontData.getElementsByTagName('Name')[0].textContent;

              var fontUnderline = fontData.getElementsByTagName('Underline')[0].textContent;
              var fontLinethrough = fontData.getElementsByTagName('Strikeout')[0].textContent;

              var textAlignData = textData.getElementsByTagName('Outline')[0];
              var textAlign = textAlignData.getElementsByTagName('Alignment')[0].textContent;

              var textSize = textData.getElementsByTagName('Size')[0].textContent;
              var textSizeArray = textSize.split(',');
              let sizeX = parseInt(textSizeArray[0]);
              let sizeY = parseInt(textSizeArray[1]);
              let mergeY = sizeY / 100;
              let mergeX = sizeX / 200;

              var fillData = textData.getElementsByTagName('Fill')[0];
              var fillColor = fillData.getElementsByTagName('Color')[0].firstChild.textContent;
              let fillCode = parseInt(fillColor, 10).toString(16).toUpperCase().substring(2);

              var outlineData = textData.getElementsByTagName('Outline')[0];
              var outlineStroke = outlineData.getElementsByTagName('Color')[0].firstChild.textContent;
              let strokeCode = parseInt(outlineStroke, 10).toString(16).toUpperCase().substring(2);

              var fontData = textData.getElementsByTagName('FontBrush')[0];
              var fontColor = fontData.getElementsByTagName('Color')[0].firstChild.textContent;
              let fontCode = parseInt(fontColor, 10).toString(16).toUpperCase().substring(2);

              var rotationData = textData.getElementsByTagName('Rotation')[0].firstChild.textContent;

              jsonDets += `{
                "type": "i-text",
                "version": "3.6.6",
                "originX": "left",
                "originY": "top",
                "left": `+ textLocX + `,
                "top": `+ textLocY + `,
                "width": 66.74,
                "height": 45.2,
                "fill": "#`+ fontCode + `",
                "stroke": "#`+ strokeCode + `",
                "strokeWidth": 1,
                "strokeDashArray": null,
                "strokeLineCap": "butt",
                "strokeDashOffset": 0,
                "strokeLineJoin": "miter",
                "strokeMiterLimit": 4,
                "scaleX": `+ mergeX + `,
                "scaleY": `+ mergeY + `,
                "angle": `+ rotationData + `,
                "flipX": false,
                "flipY": false,
                "opacity": 1,
                "shadow": null,
                "visible": true,
                "clipTo": null,
                "backgroundColor": "#`+ fillCode + `",
                "fillRule": "nonzero",
                "paintFirst": "fill",
                "globalCompositeOperation": "source-over",
                "transformMatrix": null,
                "skewX": 0,
                "skewY": 0,
                "text": "`+ text + `",
                "fontSize": 40,
                "fontWeight": "bold",
                "fontFamily": "`+ fontName + `",
                "fontStyle": "normal",
                "lineHeight": 1.16,
                "underline": `+ fontUnderline + `,
                "overline": false,
                "linethrough": `+ fontLinethrough + `,
                "textAlign": "`+ textAlign + `",
                "textBackgroundColor": "",
                "charSpacing": 0,
                "styles": {},
                "id": 381639
              },`
            }
            else if (fontWeightDet == "False" && fontStyleDet == "True") {

              var textData = items.getElementsByTagName('TextData')[0];
              var textLoc = textData.getElementsByTagName('Location')[0].textContent;
              console.log("Text: " + textLoc);
              var textLocArray = textLoc.split(',');
              var textLocX = textLocArray[0];
              var textLocY = textLocArray[1];

              var text = textData.getElementsByTagName('Text')[0].textContent;

              var fontData = textData.getElementsByTagName('Font')[0];
              var fontName = fontData.getElementsByTagName('Name')[0].textContent;

              var fontUnderline = fontData.getElementsByTagName('Underline')[0].textContent;
              var fontLinethrough = fontData.getElementsByTagName('Strikeout')[0].textContent;

              var textAlignData = textData.getElementsByTagName('Outline')[0];
              var textAlign = textAlignData.getElementsByTagName('Alignment')[0].textContent;

              var textSize = textData.getElementsByTagName('Size')[0].textContent;
              var textSizeArray = textSize.split(',');
              let sizeX = parseInt(textSizeArray[0]);
              let sizeY = parseInt(textSizeArray[1]);
              let mergeY = sizeY / 100;
              let mergeX = sizeX / 200;

              var fillData = textData.getElementsByTagName('Fill')[0];
              var fillColor = fillData.getElementsByTagName('Color')[0].firstChild.textContent;
              let fillCode = parseInt(fillColor, 10).toString(16).toUpperCase().substring(2);

              var outlineData = textData.getElementsByTagName('Outline')[0];
              var outlineStroke = outlineData.getElementsByTagName('Color')[0].firstChild.textContent;
              let strokeCode = parseInt(outlineStroke, 10).toString(16).toUpperCase().substring(2);

              var fontData = textData.getElementsByTagName('FontBrush')[0];
              var fontColor = fontData.getElementsByTagName('Color')[0].firstChild.textContent;
              let fontCode = parseInt(fontColor, 10).toString(16).toUpperCase().substring(2);

              var rotationData = textData.getElementsByTagName('Rotation')[0].firstChild.textContent;

              jsonDets += `{
                "type": "i-text",
                "version": "3.6.6",
                "originX": "left",
                "originY": "top",
                "left": `+ textLocX + `,
                "top": `+ textLocY + `,
                "width": 66.74,
                "height": 45.2,
                "fill": "#`+ fontCode + `",
                "stroke": "#`+ strokeCode + `",
                "strokeWidth": 1,
                "strokeDashArray": null,
                "strokeLineCap": "butt",
                "strokeDashOffset": 0,
                "strokeLineJoin": "miter",
                "strokeMiterLimit": 4,
                "scaleX": `+ mergeX + `,
                "scaleY": `+ mergeY + `,
                "angle": `+ rotationData + `,
                "flipX": false,
                "flipY": false,
                "opacity": 1,
                "shadow": null,
                "visible": true,
                "clipTo": null,
                "backgroundColor": "#`+ fillCode + `",
                "fillRule": "nonzero",
                "paintFirst": "fill",
                "globalCompositeOperation": "source-over",
                "transformMatrix": null,
                "skewX": 0,
                "skewY": 0,
                "text": "`+ text + `",
                "fontSize": 40,
                "fontWeight": "",
                "fontFamily": "`+ fontName + `",
                "fontStyle": "italic",
                "lineHeight": 1.16,
                "underline": `+ fontUnderline + `,
                "overline": false,
                "linethrough": `+ fontLinethrough + `,
                "textAlign": "`+ textAlign + `",
                "textBackgroundColor": "",
                "charSpacing": 0,
                "styles": {},
                "id": 381639
              },`
            }
            else if (fontWeightDet == "True" && fontStyleDet == "True") {

              var textData = items.getElementsByTagName('TextData')[0];
              var textLoc = textData.getElementsByTagName('Location')[0].textContent;
              console.log("Text: " + textLoc);
              var textLocArray = textLoc.split(',');
              var textLocX = textLocArray[0];
              var textLocY = textLocArray[1];

              var text = textData.getElementsByTagName('Text')[0].textContent;

              var fontData = textData.getElementsByTagName('Font')[0];
              var fontName = fontData.getElementsByTagName('Name')[0].textContent;

              var fontUnderline = fontData.getElementsByTagName('Underline')[0].textContent;
              var fontLinethrough = fontData.getElementsByTagName('Strikeout')[0].textContent;

              var textAlignData = textData.getElementsByTagName('Outline')[0];
              var textAlign = textAlignData.getElementsByTagName('Alignment')[0].textContent;

              var textSize = textData.getElementsByTagName('Size')[0].textContent;
              var textSizeArray = textSize.split(',');
              let sizeX = parseInt(textSizeArray[0]);
              let sizeY = parseInt(textSizeArray[1]);
              let mergeY = sizeY / 100;
              let mergeX = sizeX / 200;

              var fillData = textData.getElementsByTagName('Fill')[0];
              var fillColor = fillData.getElementsByTagName('Color')[0].firstChild.textContent;
              let fillCode = parseInt(fillColor, 10).toString(16).toUpperCase().substring(2);

              var outlineData = textData.getElementsByTagName('Outline')[0];
              var outlineStroke = outlineData.getElementsByTagName('Color')[0].firstChild.textContent;
              let strokeCode = parseInt(outlineStroke, 10).toString(16).toUpperCase().substring(2);

              var fontData = textData.getElementsByTagName('FontBrush')[0];
              var fontColor = fontData.getElementsByTagName('Color')[0].firstChild.textContent;
              let fontCode = parseInt(fontColor, 10).toString(16).toUpperCase().substring(2);

              var rotationData = textData.getElementsByTagName('Rotation')[0].firstChild.textContent;

              jsonDets += `{
                "type": "i-text",
                "version": "3.6.6",
                "originX": "left",
                "originY": "top",
                "left": `+ textLocX + `,
                "top": `+ textLocY + `,
                "width": 66.74,
                "height": 45.2,
                "fill": "#`+ fontCode + `",
                "stroke": "#`+ strokeCode + `",
                "strokeWidth": 1,
                "strokeDashArray": null,
                "strokeLineCap": "butt",
                "strokeDashOffset": 0,
                "strokeLineJoin": "miter",
                "strokeMiterLimit": 4,
                "scaleX": `+ mergeX + `,
                "scaleY": `+ mergeY + `,
                "angle": `+ rotationData + `,
                "flipX": false,
                "flipY": false,
                "opacity": 1,
                "shadow": null,
                "visible": true,
                "clipTo": null,
                "backgroundColor": "#`+ fillCode + `",
                "fillRule": "nonzero",
                "paintFirst": "fill",
                "globalCompositeOperation": "source-over",
                "transformMatrix": null,
                "skewX": 0,
                "skewY": 0,
                "text": "`+ text + `",
                "fontSize": 40,
                "fontWeight": "bold",
                "fontFamily": "`+ fontName + `",
                "fontStyle": "italic",
                "lineHeight": 1.16,
                "underline": `+ fontUnderline + `,
                "overline": false,
                "linethrough": `+ fontLinethrough + `,
                "textAlign": "`+ textAlign + `",
                "textBackgroundColor": "",
                "charSpacing": 0,
                "styles": {},
                "id": 381639
              },`
            }
            else if (fontWeightDet == "False" && fontStyleDet == "False") {

              var textData = items.getElementsByTagName('TextData')[0];
              var textLoc = textData.getElementsByTagName('Location')[0].textContent;
              console.log("Text: " + textLoc);
              var textLocArray = textLoc.split(',');
              var textLocX = textLocArray[0];
              var textLocY = textLocArray[1];

              var text = textData.getElementsByTagName('Text')[0].textContent;

              var fontData = textData.getElementsByTagName('Font')[0];
              var fontName = fontData.getElementsByTagName('Name')[0].textContent;

              var fontUnderline = fontData.getElementsByTagName('Underline')[0].textContent;
              var fontLinethrough = fontData.getElementsByTagName('Strikeout')[0].textContent;

              var textAlignData = textData.getElementsByTagName('Outline')[0];
              var textAlign = textAlignData.getElementsByTagName('Alignment')[0].textContent;

              var textSize = textData.getElementsByTagName('Size')[0].textContent;
              var textSizeArray = textSize.split(',');
              let sizeX = parseInt(textSizeArray[0]);
              let sizeY = parseInt(textSizeArray[1]);
              let mergeY = sizeY / 100;
              let mergeX = sizeX / 200;

              var fillData = textData.getElementsByTagName('Fill')[0];
              var fillColor = fillData.getElementsByTagName('Color')[0].firstChild.textContent;
              let fillCode = parseInt(fillColor, 10).toString(16).toUpperCase().substring(2);

              var outlineData = textData.getElementsByTagName('Outline')[0];
              var outlineStroke = outlineData.getElementsByTagName('Color')[0].firstChild.textContent;
              let strokeCode = parseInt(outlineStroke, 10).toString(16).toUpperCase().substring(2);

              var fontData = textData.getElementsByTagName('FontBrush')[0];
              var fontColor = fontData.getElementsByTagName('Color')[0].firstChild.textContent;
              let fontCode = parseInt(fontColor, 10).toString(16).toUpperCase().substring(2);

              var rotationData = textData.getElementsByTagName('Rotation')[0].firstChild.textContent;

              jsonDets += `{
                "type": "i-text",
                "version": "3.6.6",
                "originX": "left",
                "originY": "top",
                "left": `+ textLocX + `,
                "top": `+ textLocY + `,
                "width": 66.74,
                "height": 45.2,
                "fill": "#`+ fontCode + `",
                "stroke": "#`+ strokeCode + `",
                "strokeWidth": 1,
                "strokeDashArray": null,
                "strokeLineCap": "butt",
                "strokeDashOffset": 0,
                "strokeLineJoin": "miter",
                "strokeMiterLimit": 4,
                "scaleX": `+ mergeX + `,
                "scaleY": `+ mergeY + `,
                "angle": `+ rotationData + `,
                "flipX": false,
                "flipY": false,
                "opacity": 1,
                "shadow": null,
                "visible": true,
                "clipTo": null,
                "backgroundColor": "#`+ fillCode + `",
                "fillRule": "nonzero",
                "paintFirst": "fill",
                "globalCompositeOperation": "source-over",
                "transformMatrix": null,
                "skewX": 0,
                "skewY": 0,
                "text": "`+ text + `",
                "fontSize": 40,
                "fontWeight": "",
                "fontFamily": "`+ fontName + `",
                "fontStyle": "normal",
                "lineHeight": 1.16,
                "underline": `+ fontUnderline + `,
                "overline": false,
                "linethrough": `+ fontLinethrough + `,
                "textAlign": "`+ textAlign + `",
                "textBackgroundColor": "",
                "charSpacing": 0,
                "styles": {},
                "id": 381639
              },`
            }
          }
        }

        jsonDets = jsonDets.slice(0, -1);
        jsonDets += `],
          "background": "white"
        }`;

        // localStorage.setItem('jsonData', jsonDets);
        // const CANVASREAD = localStorage.getItem('jsonData');
        this.canvas.loadFromJSON(jsonDets, () => {
          this.canvas.renderAll();
        });
      };
      reader.readAsText(event.target.files[0]);
    }
    else {
      alert('Please select JSON or XML File');
    }
  }

  getJsonFromXml(annotaionNode) {
    var rectLoc = annotaionNode.getElementsByTagName('Location')[0].textContent;
    console.log("Rectangle: " + rectLoc);
    var rectLocArray = rectLoc.split(',');
    var rectLocX = rectLocArray[0];
    var rectLocY = rectLocArray[1];

    var rectSize = annotaionNode.getElementsByTagName('Size')[0].textContent;
    var rectSizeArray = rectSize.split(',');
    let sizeX = parseInt(rectSizeArray[0]);
    let sizeY = parseInt(rectSizeArray[1]);
    let mergeY = sizeY / 100;
    let mergeX = sizeX / 200;

    var fillData = annotaionNode.getElementsByTagName('Fill')[0];
    var fillColor = fillData.getElementsByTagName('Color')[0].firstChild.textContent;
    let fillCode = parseInt(fillColor, 10).toString(16).toUpperCase().substring(2);
    // console.log(fillCode);
    var outlineData = annotaionNode.getElementsByTagName('Outline')[0];
    var outlineStroke = outlineData.getElementsByTagName('Color')[0].firstChild.textContent;
    let strokeCode = parseInt(outlineStroke, 10).toString(16).toUpperCase().substring(2);

    var rotationData = annotaionNode.getElementsByTagName('Rotation')[0].firstChild.textContent;

    return `{"type": "rect",
            "version": "3.6.6",
            "originX": "left",
            "originY": "top",
            "left": `+ rectLocX + `,
            "top": `+ rectLocY + `,
            "width": 200,
            "height": 100,
            "fill": "#`+ fillCode + `",
            "stroke": "#`+ strokeCode + `",
            "strokeWidth": 2,
            "strokeDashArray": null,
            "strokeLineCap": "butt",
            "strokeDashOffset": 0,
            "strokeLineJoin": "miter",
            "strokeMiterLimit": 4,
            "scaleX": `+ mergeX + `,
            "scaleY": `+ mergeY + `,
            "angle": `+ rotationData + `,
            "flipX": false,
            "flipY": false,
            "opacity": 0.5,
            "shadow": null,
            "visible": true,
            "clipTo": null,
            "backgroundColor": "",
            "fillRule": "nonzero",
            "paintFirst": "fill",
            "globalCompositeOperation": "source-over",
            "transformMatrix": null,
            "skewX": 0,
            "skewY": 0,
            "rx": 0,
            "ry": 0,
            "id": 808065
          },`;
  }

  convertHextoDec(s) {

    function add(x, y) {
      var c = 0,
        r = [];
      var x = x.split('').map(Number);
      var y = y.split('').map(Number);
      while (x.length || y.length) {
        var s = (x.pop() || 0) + (y.pop() || 0) + c;
        r.unshift(s < 10 ? s : s - 10);
        c = s < 10 ? 0 : 1;
      }
      if (c) r.unshift(c);
      return r.join('');
    }

    var dec = '0';
    s.split('').forEach(function (chr) {
      var n = parseInt(chr, 16);
      for (var t = 8; t; t >>= 1) {
        dec = add(dec, dec);
        if (n & t) dec = add(dec, '1');
      }
    });
    return dec;
  }

  convertDectoHex(s) {
    var s = s.toString(16);
    if (s.length == 1)
      s = "0" + s;
    return s;
  }

  xmlJson() {
    let hideBtn = document.getElementById('hid');
    if (hideBtn) {
      hideBtn.remove();
    }
    // "419430655" transparent color code for atlasoft
    this.xml = JSON.stringify(this.canvas, null, 2);
    var json = JSON.parse(this.xml);

    this.xmlData = `<?xml version="1.0" encoding="utf-8"?>
  <x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about="" xmlns:xmp="http://ns.abobe.com/xap/1.0/">
      <xmp:CreatorTool id="creatorTool">Atalasoft DotAnnotate 11.2</xmp:CreatorTool>
      <xmp:CreateDate><![CDATA[2022-03-08T02:19:13]]></xmp:CreateDate>
  </rdf:Description>
  <rdf:Description rdf:about="DotAnnotate Annotations" xmlns:xmp="http://ns.abobe.com/xap/4.0/">
      <DocumentResolution>1,1</DocumentResolution>
      <LayerDataCollection>
          <LayerData assembly="Atalasoft.dotImage" namespace="Atalasoft.Annotate">
              <CreationTime type="System.String"><![CDATA[2022-03-08T02:19:12]]></CreationTime>
              <ModifiedTime type="System.String"><![CDATA[2022-03-08T02:19:12]]></ModifiedTime>
              <Location type="System.String"><![CDATA[359.0909,245.4545]]></Location>
              <Rotation type="System.Single">0</Rotation>
              <Size type="System.String"><![CDATA[481.87,239]]></Size>
              <Visible type="System.Boolean">True</Visible>
              <CanMove type="System.Boolean">True</CanMove>
              <CanResize type="System.Boolean">True</CanResize>
              <CanRotate type="System.Boolean">False</CanRotate>
              <CanMirror type="System.Boolean">False</CanMirror>
              <CanSelect type="System.Boolean">True</CanSelect>
              <ExtraProperties assembly="System" type="System.Collections.Specialized.StringCollection" />
              <GroupAnnotation type="System.Boolean">False</GroupAnnotation>
              <Items assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationDataCollection">
              <Items type="System.Collections.ArrayList">
              `;
    for (let i = 0; i < json.objects.length; i++) {
      if (json.objects[i].type == "rect") {
        if(json.objects[i].rx == "1" && json.objects[i].fill != "") {
          let height = json.objects[i].height;
          let scaleY = json.objects[i].scaleY;
          let mergeY = height * scaleY;
          
          let width = json.objects[i].width;
          let scaleX = json.objects[i].scaleX;
          let mergeX = width * scaleX;

          let fill = '4B' + json.objects[i].fill;
          var color = fill.replace('#', '');
          
          let stroke = '4B' + json.objects[i].stroke;
          var strokeColor = stroke.replace('#', '');

          this.xmlData += `
                <RectangleData assembly="Atalasoft.dotImage" namespace="Atalasoft.Annotate">
                <CreationTime type="System.String">
                    <![CDATA[2022-04-18T02:31:30]]>
                </CreationTime>
                <ModifiedTime type="System.String">
                    <![CDATA[2022-04-18T02:32:07]]>
                </ModifiedTime>
                <Location type="System.String"><![CDATA[`+json.objects[i].left+`,`+json.objects[i].top+`]]></Location>
                <Rotation type="System.Single"><![CDATA[`+json.objects[i].angle+`]]></Rotation>
                <Size type="System.String"><![CDATA[`+mergeX+`,`+mergeY+`]]></Size>
                <Visible type="System.Boolean">True</Visible>
                <CanMove type="System.Boolean">True</CanMove>
                <CanResize type="System.Boolean">True</CanResize>
                <CanRotate type="System.Boolean">True</CanRotate>
                <CanMirror type="System.Boolean">True</CanMirror>
                <CanSelect type="System.Boolean">True</CanSelect>
                <ExtraProperties assembly="System"
                    type="System.Collections.Specialized.StringCollection" />
                <Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
                    <ctor type="System.Int32">0</ctor>
                    <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(color)+`]]></Color>
                </Fill>
                <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
                    <ctor type="System.Int32">3</ctor>
                    <Alignment type="System.String">
                        <![CDATA[Center]]>
                    </Alignment>
                    <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(strokeColor)+`]]></Color>
                    <DashCap type="System.String">
                        <![CDATA[Round]]>
                    </DashCap>
                    <DashOffset type="System.Single">0</DashOffset>
                    <DashStyle type="System.String">
                        <![CDATA[Solid]]>
                    </DashStyle>
                    <EndCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
                        <Style type="System.String"><![CDATA[None]]></Style>
                        <Size type="System.String">
                            <![CDATA[15,15]]>
                        </Size>
                    </EndCap>
                    <LineJoin type="System.String">
                        <![CDATA[Round]]>
                    </LineJoin>
                    <MiterLimit type="System.Single">0</MiterLimit>
                    <StartCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
                        <Style type="System.String"><![CDATA[None]]></Style>
                        <Size type="System.String">
                            <![CDATA[15,15]]>
                        </Size>
                    </StartCap>
                    <Width type="System.Single">4</Width>
                </Outline>
                <Translucent type="System.Boolean">False</Translucent>
            </RectangleData>`;
          }
          else if(json.objects[i].rx == "0" && json.objects[i].fill == ""){
            let height = json.objects[i].height;
            let scaleY = json.objects[i].scaleY;
            let mergeY = height * scaleY;
  
            let width = json.objects[i].width;
            let scaleX = json.objects[i].scaleX;
            let mergeX = width * scaleX;
  
            let stroke = '4B' + json.objects[i].stroke;
            var strokeColor = stroke.replace('#', '');
  
            this.xmlData += `
              <RectangleData assembly="Atalasoft.dotImage" namespace="Atalasoft.Annotate">
              <CreationTime type="System.String">
                  <![CDATA[2022-04-18T02:31:30]]>
              </CreationTime>
              <ModifiedTime type="System.String">
                  <![CDATA[2022-04-18T02:32:07]]>
              </ModifiedTime>
              <Location type="System.String"><![CDATA[`+json.objects[i].left+`,`+json.objects[i].top+`]]></Location>
              <Rotation type="System.Single">` + json.objects[i].angle + `</Rotation>
              <Size type="System.String"><![CDATA[`+mergeX+`,`+mergeY+`]]></Size>
              <Visible type="System.Boolean">True</Visible>
              <CanMove type="System.Boolean">True</CanMove>
              <CanResize type="System.Boolean">True</CanResize>
              <CanRotate type="System.Boolean">True</CanRotate>
              <CanMirror type="System.Boolean">True</CanMirror>
              <CanSelect type="System.Boolean">True</CanSelect>
              <ExtraProperties assembly="System"
                  type="System.Collections.Specialized.StringCollection" />
              <Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
                  <ctor type="System.Int32">0</ctor>
                  <Color type="System.Int32"><![CDATA[16777215]]></Color>
              </Fill>
              <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
                  <ctor type="System.Int32">3</ctor>
                  <Alignment type="System.String">
                      <![CDATA[Center]]>
                  </Alignment>
                  <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(strokeColor)+`]]></Color>
                  <DashCap type="System.String">
                      <![CDATA[Round]]>
                  </DashCap>
                  <DashOffset type="System.Single">0</DashOffset>
                  <DashStyle type="System.String">
                      <![CDATA[Solid]]>
                  </DashStyle>
                  <EndCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
                      <Style type="System.String"><![CDATA[None]]></Style>
                      <Size type="System.String">
                          <![CDATA[15,15]]>
                      </Size>
                  </EndCap>
                  <LineJoin type="System.String">
                      <![CDATA[Round]]>
                  </LineJoin>
                  <MiterLimit type="System.Single">0</MiterLimit>
                  <StartCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
                      <Style type="System.String"><![CDATA[None]]></Style>
                      <Size type="System.String">
                          <![CDATA[15,15]]>
                      </Size>
                  </StartCap>
                  <Width type="System.Single">4</Width>
              </Outline>
              <Translucent type="System.Boolean">False</Translucent>
          </RectangleData>`;
          }
          else if(json.objects[i].rx == "0" && json.objects[i].fill != ""){
            let height = json.objects[i].height;
            let scaleY = json.objects[i].scaleY;
            let mergeY = height * scaleY;
            
            let width = json.objects[i].width;
            let scaleX = json.objects[i].scaleX;
            let mergeX = width * scaleX;

            let fill = '4B' + json.objects[i].fill;
            var color = fill.replace('#', '');
            
            let stroke = '4B' + json.objects[i].stroke;
            var strokeColor = stroke.replace('#', '');

            this.xmlData += `
          <RectangleData assembly="Atalasoft.dotImage" namespace="Atalasoft.Annotate">
          <CreationTime type="System.String">
              <![CDATA[2022-04-18T02:31:30]]>
          </CreationTime>
          <ModifiedTime type="System.String">
              <![CDATA[2022-04-18T02:32:07]]>
          </ModifiedTime>
          <Location type="System.String"><![CDATA[`+json.objects[i].left+`,`+json.objects[i].top+`]]></Location>
          <Rotation type="System.Single">`+json.objects[i].angle+`</Rotation>
          <Size type="System.String"><![CDATA[`+mergeX+`,`+mergeY+`]]></Size>
          <Visible type="System.Boolean">True</Visible>
          <CanMove type="System.Boolean">True</CanMove>
          <CanResize type="System.Boolean">True</CanResize>
          <CanRotate type="System.Boolean">True</CanRotate>
          <CanMirror type="System.Boolean">True</CanMirror>
          <CanSelect type="System.Boolean">True</CanSelect>
          <ExtraProperties assembly="System"
              type="System.Collections.Specialized.StringCollection" />
          <Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
              <ctor type="System.Int32">0</ctor>
              <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(color)+`]]></Color>
          </Fill>
          <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
              <ctor type="System.Int32">3</ctor>
              <Alignment type="System.String">
                  <![CDATA[Center]]>
              </Alignment>
              <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(strokeColor)+`]]></Color>
              <DashCap type="System.String">
                  <![CDATA[Round]]>
              </DashCap>
              <DashOffset type="System.Single">0</DashOffset>
              <DashStyle type="System.String">
                  <![CDATA[Solid]]>
              </DashStyle>
              <EndCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
                  <Style type="System.String"><![CDATA[None]]></Style>
                  <Size type="System.String">
                      <![CDATA[15,15]]>
                  </Size>
              </EndCap>
              <LineJoin type="System.String">
                  <![CDATA[Round]]>
              </LineJoin>
              <MiterLimit type="System.Single">0</MiterLimit>
              <StartCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
                  <Style type="System.String"><![CDATA[None]]></Style>
                  <Size type="System.String">
                      <![CDATA[15,15]]>
                  </Size>
              </StartCap>
              <Width type="System.Single">4</Width>
          </Outline>
          <Translucent type="System.Boolean">False</Translucent>
      </RectangleData>`;
          }
      }
      else if (json.objects[i].type == "circle") {
        if(json.objects[i].skewX == 1){
          let height = json.objects[i].height;
          let scaleY = json.objects[i].scaleY;
          let mergeY = height * scaleY;

          let width = json.objects[i].width;
          let scaleX = json.objects[i].scaleX;
          let mergeX = width * scaleX;

          let fill = '4B' + json.objects[i].fill;
          var color = fill.replace('#', '');
          
          let stroke = '4B' + json.objects[i].stroke;
          var strokeColor = stroke.replace('#', '');
          

          this.xmlData += `
            <EllipseData assembly="Atalasoft.dotImage" namespace="Atalasoft.Annotate">
            <CreationTime type="System.String"><![CDATA[2022-04-07T07:17:22]]></CreationTime>
            <ModifiedTime type="System.String"><![CDATA[2022-04-07T07:17:30]]></ModifiedTime>
            <Location type="System.String"><![CDATA[`+json.objects[i].left+`,`+json.objects[i].top+`]]></Location>
            <Rotation type="System.Single">0</Rotation>
            <Size type="System.String"><![CDATA[`+mergeX+`,`+mergeY+`]]></Size>
            <Visible type="System.Boolean">True</Visible>
            <CanMove type="System.Boolean">True</CanMove>
            <CanResize type="System.Boolean">True</CanResize>
            <CanRotate type="System.Boolean">True</CanRotate>
            <CanMirror type="System.Boolean">True</CanMirror>
            <CanSelect type="System.Boolean">True</CanSelect>
            <ExtraProperties assembly="System" type="System.Collections.Specialized.StringCollection" />
            <Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
              <ctor type="System.Int32">0</ctor>
              <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(color)+`]]></Color>
            </Fill>
            <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
              <ctor type="System.Int32">3</ctor>
              <Alignment type="System.String"><![CDATA[Center]]></Alignment>
              <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(strokeColor)+`]]></Color>
              <DashCap type="System.String"><![CDATA[Round]]></DashCap>
              <DashOffset type="System.Single">0</DashOffset>
              <DashStyle type="System.String"><![CDATA[Solid]]></DashStyle>
              <EndCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
                <Style type="System.String"><![CDATA[None]]></Style>
                <Size type="System.String"><![CDATA[15,15]]></Size>
              </EndCap>
              <LineJoin type="System.String"><![CDATA[Round]]></LineJoin>
              <MiterLimit type="System.Single">0</MiterLimit>
              <StartCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
                <Style type="System.String"><![CDATA[None]]></Style>
                <Size type="System.String"><![CDATA[15,15]]></Size>
              </StartCap>
              <Width type="System.Single">4</Width>
            </Outline>
            <Translucent type="System.Boolean">False</Translucent>
          </EllipseData>`;
        }
        else if(json.objects[i].skewX == 0){
          let height = json.objects[i].height;
          let scaleY = json.objects[i].scaleY;
          let mergeY = height * scaleY;

          let width = json.objects[i].width;
          let scaleX = json.objects[i].scaleX;
          let mergeX = width * scaleX;

          let fill = '4B' + json.objects[i].fill;
          var color = fill.replace('#', '');
          
          let stroke = '4B' + json.objects[i].stroke;
          var strokeColor = stroke.replace('#', '');
          

          this.xmlData += `
            <EllipseData assembly="Atalasoft.dotImage" namespace="Atalasoft.Annotate">
            <CreationTime type="System.String"><![CDATA[2022-04-07T07:17:22]]></CreationTime>
            <ModifiedTime type="System.String"><![CDATA[2022-04-07T07:17:30]]></ModifiedTime>
            <Location type="System.String"><![CDATA[`+json.objects[i].left+`,`+json.objects[i].top+`]]></Location>
            <Rotation type="System.Single">0</Rotation>
            <Size type="System.String"><![CDATA[`+mergeX+`,`+mergeY+`]]></Size>
            <Visible type="System.Boolean">True</Visible>
            <CanMove type="System.Boolean">True</CanMove>
            <CanResize type="System.Boolean">True</CanResize>
            <CanRotate type="System.Boolean">True</CanRotate>
            <CanMirror type="System.Boolean">True</CanMirror>
            <CanSelect type="System.Boolean">True</CanSelect>
            <ExtraProperties assembly="System" type="System.Collections.Specialized.StringCollection" />
            <Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
              <ctor type="System.Int32">0</ctor>
              <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(color)+`]]></Color>
            </Fill>
            <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
              <ctor type="System.Int32">3</ctor>
              <Alignment type="System.String"><![CDATA[Center]]></Alignment>
              <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(strokeColor)+`]]></Color>
              <DashCap type="System.String"><![CDATA[Round]]></DashCap>
              <DashOffset type="System.Single">0</DashOffset>
              <DashStyle type="System.String"><![CDATA[Solid]]></DashStyle>
              <EndCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
                <Style type="System.String"><![CDATA[None]]></Style>
                <Size type="System.String"><![CDATA[15,15]]></Size>
              </EndCap>
              <LineJoin type="System.String"><![CDATA[Round]]></LineJoin>
              <MiterLimit type="System.Single">0</MiterLimit>
              <StartCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
                <Style type="System.String"><![CDATA[None]]></Style>
                <Size type="System.String"><![CDATA[15,15]]></Size>
              </StartCap>
              <Width type="System.Single">4</Width>
            </Outline>
            <Translucent type="System.Boolean">False</Translucent>
          </EllipseData>`;
        }
      }
      else if (json.objects[i].type == "i-text") {
        if(json.objects[i].fontWeight == "bold" && json.objects[i].fontStyle == "italic"){
          let height = json.objects[i].height;
          let scaleY = json.objects[i].scaleY;
          let mergeY = height * scaleY;

          let width = json.objects[i].width;
          let scaleX = json.objects[i].scaleX;
          let mergeX = width * scaleX;

          let fill = '4B' + json.objects[i].fill;
          var color = fill.replace('#', '');
          
          let stroke = '4B' + json.objects[i].stroke;
          var strokeColor = stroke.replace('#', '');

          let bgColor = '4B' + json.objects[i].backgroundColor
          var backColor = bgColor.replace('#', '');

          this.xmlData += `
        <TextData assembly="Atalasoft.dotImage" namespace="Atalasoft.Annotate">
        <CreationTime type="System.String"><![CDATA[2022-04-07T07:17:38]]></CreationTime>
        <ModifiedTime type="System.String"><![CDATA[2022-04-07T07:18:01]]></ModifiedTime>
        <Location type="System.String"><![CDATA[`+json.objects[i].left+`,`+json.objects[i].top+`]]></Location>
        <Rotation type="System.Single"><![CDATA[`+json.objects[i].angle+`]]></Rotation>
        <Size type="System.String"><![CDATA[`+mergeX+`,`+mergeY+`]]></Size>
        <Visible type="System.Boolean">True</Visible>
        <CanMove type="System.Boolean">True</CanMove>
        <CanResize type="System.Boolean">True</CanResize>
        <CanRotate type="System.Boolean">True</CanRotate>
        <CanMirror type="System.Boolean">True</CanMirror>
        <CanSelect type="System.Boolean">True</CanSelect>
        <ExtraProperties assembly="System" type="System.Collections.Specialized.StringCollection">
          <ExtraPropertiesEntry type="System.String"><![CDATA[AllowEditing]]></ExtraPropertiesEntry>
          <ExtraPropertiesEntry type="System.String"><![CDATA[True]]></ExtraPropertiesEntry>
        </ExtraProperties>
        <Padding type="System.Single">2</Padding>
        <Text type="System.String"><![CDATA[`+json.objects[i].text+`]]></Text>
        <Font assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationFont">
          <Name type="System.String"><![CDATA[`+json.objects[i].fontFamily+`]]></Name>
          <Size type="System.Single"><![CDATA[`+json.objects[i].fontSize+`]]></Size>
          <Bold type="System.Boolean">True</Bold>
          <Italic type="System.Boolean">True</Italic>
          <Strikeout type="System.Boolean"><![CDATA[`+json.objects[i].linethrough+`]]></Strikeout>
          <Underline type="System.Boolean"><![CDATA[`+json.objects[i].underline+`]]></Underline>
          <CharSet type="System.Int32">0</CharSet>
        </Font>
        <FontBrush assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
          <ctor type="System.Int32">0</ctor>
          <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(color)+`]]></Color>
        </FontBrush>
        <Alignment type="System.String"><![CDATA[Near]]></Alignment>
        <LineAlignment type="System.String"><![CDATA[Near]]></LineAlignment>
        <FormatFlags type="System.Int32">0</FormatFlags>
        <Trimming type="System.String"><![CDATA[None]]></Trimming>
        <Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
          <ctor type="System.Int32">0</ctor>
          <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(backColor)+`]]></Color>
        </Fill>
        <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
          <ctor type="System.Int32">3</ctor>
          <Alignment type="System.String"><![CDATA[`+json.objects[i].textAlign+`]]></Alignment>
          <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(strokeColor)+`]]></Color>
          <DashCap type="System.String"><![CDATA[Round]]></DashCap>
          <DashOffset type="System.Single">0</DashOffset>
          <DashStyle type="System.String"><![CDATA[Solid]]></DashStyle>
          <EndCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
            <Style type="System.String"><![CDATA[None]]></Style>
            <Size type="System.String"><![CDATA[15,15]]></Size>
          </EndCap>
          <LineJoin type="System.String"><![CDATA[Round]]></LineJoin>
          <MiterLimit type="System.Single"><![CDATA[`+json.objects[i].strokeMiterLimit+`]]></MiterLimit>
          <StartCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
            <Style type="System.String"><![CDATA[None]]></Style>
            <Size type="System.String"><![CDATA[15,15]]></Size>
          </StartCap>
          <Width type="System.Single">4</Width>
        </Outline>
        <AutoSize type="System.Boolean">False</AutoSize>
        <RenderingHint type="System.String"><![CDATA[SystemDefault]]></RenderingHint>
        <Minimized type="System.Boolean">False</Minimized>
      </TextData>`;
        }
        else if(json.objects[i].fontWeight == "" && json.objects[i].fontStyle == "normal"){
          let height = json.objects[i].height;
          let scaleY = json.objects[i].scaleY;
          let mergeY = height * scaleY;

          let width = json.objects[i].width;
          let scaleX = json.objects[i].scaleX;
          let mergeX = width * scaleX;

          let fill = '4B' + json.objects[i].fill;
          var color = fill.replace('#', '');
          
          let stroke = '4B' + json.objects[i].stroke;
          var strokeColor = stroke.replace('#', '');

          let bgColor = '4B' + json.objects[i].backgroundColor
          var backColor = bgColor.replace('#', '');

          this.xmlData += `
        <TextData assembly="Atalasoft.dotImage" namespace="Atalasoft.Annotate">
        <CreationTime type="System.String"><![CDATA[2022-04-07T07:17:38]]></CreationTime>
        <ModifiedTime type="System.String"><![CDATA[2022-04-07T07:18:01]]></ModifiedTime>
        <Location type="System.String"><![CDATA[`+json.objects[i].left+`,`+json.objects[i].top+`]]></Location>
        <Rotation type="System.Single"><![CDATA[`+json.objects[i].angle+`]]></Rotation>
        <Size type="System.String"><![CDATA[`+mergeX+`,`+mergeY+`]]></Size>
        <Visible type="System.Boolean">True</Visible>
        <CanMove type="System.Boolean">True</CanMove>
        <CanResize type="System.Boolean">True</CanResize>
        <CanRotate type="System.Boolean">True</CanRotate>
        <CanMirror type="System.Boolean">True</CanMirror>
        <CanSelect type="System.Boolean">True</CanSelect>
        <ExtraProperties assembly="System" type="System.Collections.Specialized.StringCollection">
          <ExtraPropertiesEntry type="System.String"><![CDATA[AllowEditing]]></ExtraPropertiesEntry>
          <ExtraPropertiesEntry type="System.String"><![CDATA[True]]></ExtraPropertiesEntry>
        </ExtraProperties>
        <Padding type="System.Single">2</Padding>
        <Text type="System.String"><![CDATA[`+json.objects[i].text+`]]></Text>
        <Font assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationFont">
          <Name type="System.String"><![CDATA[`+json.objects[i].fontFamily+`]]></Name>
          <Size type="System.Single"><![CDATA[`+json.objects[i].fontSize+`]]></Size>
          <Bold type="System.Boolean">False</Bold>
          <Italic type="System.Boolean">False</Italic>
          <Strikeout type="System.Boolean"><![CDATA[`+json.objects[i].linethrough+`]]></Strikeout>
          <Underline type="System.Boolean"><![CDATA[`+json.objects[i].underline+`]]></Underline>
          <CharSet type="System.Int32">0</CharSet>
        </Font>
        <FontBrush assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
          <ctor type="System.Int32">0</ctor>
          <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(color)+`]]></Color>
        </FontBrush>
        <Alignment type="System.String"><![CDATA[Near]]></Alignment>
        <LineAlignment type="System.String"><![CDATA[Near]]></LineAlignment>
        <FormatFlags type="System.Int32">0</FormatFlags>
        <Trimming type="System.String"><![CDATA[None]]></Trimming>
        <Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
          <ctor type="System.Int32">0</ctor>
          <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(backColor)+`]]></Color>
        </Fill>
        <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
          <ctor type="System.Int32">3</ctor>
          <Alignment type="System.String"><![CDATA[`+json.objects[i].textAlign+`]]></Alignment>
          <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(strokeColor)+`]]></Color>
          <DashCap type="System.String"><![CDATA[Round]]></DashCap>
          <DashOffset type="System.Single">0</DashOffset>
          <DashStyle type="System.String"><![CDATA[Solid]]></DashStyle>
          <EndCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
            <Style type="System.String"><![CDATA[None]]></Style>
            <Size type="System.String"><![CDATA[15,15]]></Size>
          </EndCap>
          <LineJoin type="System.String"><![CDATA[Round]]></LineJoin>
          <MiterLimit type="System.Single"><![CDATA[`+json.objects[i].strokeMiterLimit+`]]></MiterLimit>
          <StartCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
            <Style type="System.String"><![CDATA[None]]></Style>
            <Size type="System.String"><![CDATA[15,15]]></Size>
          </StartCap>
          <Width type="System.Single">4</Width>
        </Outline>
        <AutoSize type="System.Boolean">False</AutoSize>
        <RenderingHint type="System.String"><![CDATA[SystemDefault]]></RenderingHint>
        <Minimized type="System.Boolean">False</Minimized>
      </TextData>`;
        }
        else if(json.objects[i].fontWeight == "" && json.objects[i].fontStyle == "italic"){
          let height = json.objects[i].height;
          let scaleY = json.objects[i].scaleY;
          let mergeY = height * scaleY;

          let width = json.objects[i].width;
          let scaleX = json.objects[i].scaleX;
          let mergeX = width * scaleX;

          let fill = '4B' + json.objects[i].fill;
          var color = fill.replace('#', '');
          
          let stroke = '4B' + json.objects[i].stroke;
          var strokeColor = stroke.replace('#', '');

          let bgColor = '4B' + json.objects[i].backgroundColor
          var backColor = bgColor.replace('#', '');

          this.xmlData += `
        <TextData assembly="Atalasoft.dotImage" namespace="Atalasoft.Annotate">
        <CreationTime type="System.String"><![CDATA[2022-04-07T07:17:38]]></CreationTime>
        <ModifiedTime type="System.String"><![CDATA[2022-04-07T07:18:01]]></ModifiedTime>
        <Location type="System.String"><![CDATA[`+json.objects[i].left+`,`+json.objects[i].top+`]]></Location>
        <Rotation type="System.Single"><![CDATA[`+json.objects[i].angle+`]]></Rotation>
        <Size type="System.String"><![CDATA[`+mergeX+`,`+mergeY+`]]></Size>
        <Visible type="System.Boolean">True</Visible>
        <CanMove type="System.Boolean">True</CanMove>
        <CanResize type="System.Boolean">True</CanResize>
        <CanRotate type="System.Boolean">True</CanRotate>
        <CanMirror type="System.Boolean">True</CanMirror>
        <CanSelect type="System.Boolean">True</CanSelect>
        <ExtraProperties assembly="System" type="System.Collections.Specialized.StringCollection">
          <ExtraPropertiesEntry type="System.String"><![CDATA[AllowEditing]]></ExtraPropertiesEntry>
          <ExtraPropertiesEntry type="System.String"><![CDATA[True]]></ExtraPropertiesEntry>
        </ExtraProperties>
        <Padding type="System.Single">2</Padding>
        <Text type="System.String"><![CDATA[`+json.objects[i].text+`]]></Text>
        <Font assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationFont">
          <Name type="System.String"><![CDATA[`+json.objects[i].fontFamily+`]]></Name>
          <Size type="System.Single"><![CDATA[`+json.objects[i].fontSize+`]]></Size>
          <Bold type="System.Boolean">False</Bold>
          <Italic type="System.Boolean">True</Italic>
          <Strikeout type="System.Boolean"><![CDATA[`+json.objects[i].linethrough+`]]></Strikeout>
          <Underline type="System.Boolean"><![CDATA[`+json.objects[i].underline+`]]></Underline>
          <CharSet type="System.Int32">0</CharSet>
        </Font>
        <FontBrush assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
          <ctor type="System.Int32">0</ctor>
          <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(color)+`]]></Color>
        </FontBrush>
        <Alignment type="System.String"><![CDATA[Near]]></Alignment>
        <LineAlignment type="System.String"><![CDATA[Near]]></LineAlignment>
        <FormatFlags type="System.Int32">0</FormatFlags>
        <Trimming type="System.String"><![CDATA[None]]></Trimming>
        <Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
          <ctor type="System.Int32">0</ctor>
          <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(backColor)+`]]></Color>
        </Fill>
        <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
          <ctor type="System.Int32">3</ctor>
          <Alignment type="System.String"><![CDATA[`+json.objects[i].textAlign+`]]></Alignment>
          <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(strokeColor)+`]]></Color>
          <DashCap type="System.String"><![CDATA[Round]]></DashCap>
          <DashOffset type="System.Single">0</DashOffset>
          <DashStyle type="System.String"><![CDATA[Solid]]></DashStyle>
          <EndCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
            <Style type="System.String"><![CDATA[None]]></Style>
            <Size type="System.String"><![CDATA[15,15]]></Size>
          </EndCap>
          <LineJoin type="System.String"><![CDATA[Round]]></LineJoin>
          <MiterLimit type="System.Single"><![CDATA[`+json.objects[i].strokeMiterLimit+`]]></MiterLimit>
          <StartCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
            <Style type="System.String"><![CDATA[None]]></Style>
            <Size type="System.String"><![CDATA[15,15]]></Size>
          </StartCap>
          <Width type="System.Single">4</Width>
        </Outline>
        <AutoSize type="System.Boolean">False</AutoSize>
        <RenderingHint type="System.String"><![CDATA[SystemDefault]]></RenderingHint>
        <Minimized type="System.Boolean">False</Minimized>
      </TextData>`;
        }
        else if(json.objects[i].fontWeight == "bold" && json.objects[i].fontStyle == "normal"){
          let height = json.objects[i].height;
          let scaleY = json.objects[i].scaleY;
          let mergeY = height * scaleY;

          let width = json.objects[i].width;
          let scaleX = json.objects[i].scaleX;
          let mergeX = width * scaleX;

          let fill = '4B' + json.objects[i].fill;
          var color = fill.replace('#', '');
          
          let stroke = '4B' + json.objects[i].stroke;
          var strokeColor = stroke.replace('#', '');

          let bgColor = '4B' + json.objects[i].backgroundColor
          var backColor = bgColor.replace('#', '');

          this.xmlData += `
        <TextData assembly="Atalasoft.dotImage" namespace="Atalasoft.Annotate">
        <CreationTime type="System.String"><![CDATA[2022-04-07T07:17:38]]></CreationTime>
        <ModifiedTime type="System.String"><![CDATA[2022-04-07T07:18:01]]></ModifiedTime>
        <Location type="System.String"><![CDATA[`+json.objects[i].left+`,`+json.objects[i].top+`]]></Location>
        <Rotation type="System.Single"><![CDATA[`+json.objects[i].angle+`]]></Rotation>
        <Size type="System.String"><![CDATA[`+mergeX+`,`+mergeY+`]]></Size>
        <Visible type="System.Boolean">True</Visible>
        <CanMove type="System.Boolean">True</CanMove>
        <CanResize type="System.Boolean">True</CanResize>
        <CanRotate type="System.Boolean">True</CanRotate>
        <CanMirror type="System.Boolean">True</CanMirror>
        <CanSelect type="System.Boolean">True</CanSelect>
        <ExtraProperties assembly="System" type="System.Collections.Specialized.StringCollection">
          <ExtraPropertiesEntry type="System.String"><![CDATA[AllowEditing]]></ExtraPropertiesEntry>
          <ExtraPropertiesEntry type="System.String"><![CDATA[True]]></ExtraPropertiesEntry>
        </ExtraProperties>
        <Padding type="System.Single">2</Padding>
        <Text type="System.String"><![CDATA[`+json.objects[i].text+`]]></Text>
        <Font assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationFont">
          <Name type="System.String"><![CDATA[`+json.objects[i].fontFamily+`]]></Name>
          <Size type="System.Single"><![CDATA[`+json.objects[i].fontSize+`]]></Size>
          <Bold type="System.Boolean">True</Bold>
          <Italic type="System.Boolean">False</Italic>
          <Strikeout type="System.Boolean"><![CDATA[`+json.objects[i].linethrough+`]]></Strikeout>
          <Underline type="System.Boolean"><![CDATA[`+json.objects[i].underline+`]]></Underline>
          <CharSet type="System.Int32">0</CharSet>
        </Font>
        <FontBrush assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
          <ctor type="System.Int32">0</ctor>
          <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(color)+`]]></Color>
        </FontBrush>
        <Alignment type="System.String"><![CDATA[Near]]></Alignment>
        <LineAlignment type="System.String"><![CDATA[Near]]></LineAlignment>
        <FormatFlags type="System.Int32">0</FormatFlags>
        <Trimming type="System.String"><![CDATA[None]]></Trimming>
        <Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
          <ctor type="System.Int32">0</ctor>
          <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(backColor)+`]]></Color>
        </Fill>
        <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
          <ctor type="System.Int32">3</ctor>
          <Alignment type="System.String"><![CDATA[`+json.objects[i].textAlign+`]]></Alignment>
          <Color type="System.Int32"><![CDATA[`+this.convertHextoDec(strokeColor)+`]]></Color>
          <DashCap type="System.String"><![CDATA[Round]]></DashCap>
          <DashOffset type="System.Single">0</DashOffset>
          <DashStyle type="System.String"><![CDATA[Solid]]></DashStyle>
          <EndCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
            <Style type="System.String"><![CDATA[None]]></Style>
            <Size type="System.String"><![CDATA[15,15]]></Size>
          </EndCap>
          <LineJoin type="System.String"><![CDATA[Round]]></LineJoin>
          <MiterLimit type="System.Single"><![CDATA[`+json.objects[i].strokeMiterLimit+`]]></MiterLimit>
          <StartCap assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationLineCap">
            <Style type="System.String"><![CDATA[None]]></Style>
            <Size type="System.String"><![CDATA[15,15]]></Size>
          </StartCap>
          <Width type="System.Single">4</Width>
        </Outline>
        <AutoSize type="System.Boolean">False</AutoSize>
        <RenderingHint type="System.String"><![CDATA[SystemDefault]]></RenderingHint>
        <Minimized type="System.Boolean">False</Minimized>
      </TextData>`;
        }
      }
    }
    this.xmlData += `</Items>
  </Items>
  </LayerData>
  </LayerDataCollection>
  </rdf:Description>
  </rdf:RDF>
  </x:xmpmeta>`;

    let anchor = document.createElement("a");
    anchor.className = "btn btn-outline-dark btn-sm";
    anchor.setAttribute("id", "hid");
    anchor.style.marginLeft = '10px';
    let a_text = document.createTextNode('Download XML File');
    anchor.appendChild(a_text);

    let iTag = document.createElement("i");
    iTag.setAttribute("class", "fa fa-download");
    iTag.style.marginLeft = "5px";

    anchor.appendChild(iTag);

    anchor.download = "sample.xml";
    anchor.href = "data:text/xml," + encodeURIComponent(this.xmlData);

    let divCont = document.getElementById('card-header');
    divCont.appendChild(anchor);
  }

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
  }
}
