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

  constructor() {}

  ngAfterViewInit(): void {


    // setup front side canvas
    this.canvas = new fabric.Canvas('canvas', {
      hoverCursor: 'pointer',
      selection: false,
      selectionBorderColor: 'blue',
      // backgroundImage: backImg,
      backgroundColor: 'white',
    });

    this.canvas.on({
      'object:moving': (e) => {},
      'object:modified': (e) => {},
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

    // get references to the html canvas element & its context
    this.canvas.on('mouse:down', (e) => {
      const canvasElement: any = document.getElementById('canvas');
    });

  }
  UploadImg() {

  }

  /*------------------------Block elements------------------------*/

  // Block "Size"

  changeSize() {
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
  }

  // Block "Add text"

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

  // Block "Add images"

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

  // Block "Upload Image"

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

  /*Canvas*/

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

  /*------------------------Global actions for element------------------------*/

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

  /*System*/


  removeSelected() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      this.canvas.remove(activeObject);
      // this.textString = '';
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
    //alert(this.canvas.getHeight() + ' AND ' + this.canvas.getWidth());
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
        localStorage.setItem('jsonData', textJson);

        const CANVAS = localStorage.getItem('jsonData');
        this.canvas.loadFromJSON(CANVAS, () => {
          console.log('CANVAS untar');
          console.log(CANVAS);
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
        var xmlDoc=(new DOMParser()).parseFromString(CANVAS,"text/xml");
        
        var items = xmlDoc.getElementsByTagName('Items')[1];
        
        // var rectLocArray = rectLoc.split(',');
        // console.warn(rectLocArray[0]);
        // console.warn(rectLocArray[1]);
        
        this.json = `{
          "version": "3.6.6",
          "objects": [
            {`;
        for(var i = 0; i < items.childNodes.length; i++) {
          if(items.childNodes[i].nodeName == 'RectangleData') {

            var rectData = xmlDoc.getElementsByTagName('RectangleData')[0];
            var rectLoc = rectData.getElementsByTagName('Location')[0].firstChild.textContent.split(',');
            // var rectLocArray = rectLoc.split(',');
            var rectLocX = rectLoc[0];
            var rectLocY = rectLoc[1];
            alert(rectLocX);
            alert(rectLocY);

            var rectSize = rectData.getElementsByTagName('Size')[0].firstChild.textContent;
            var rectSizeArray = rectSize.split(',');
            let sizeX = parseInt(rectSizeArray[0]);
            let sizeY = parseInt(rectSizeArray[1]);
            let mergeY = sizeY / 100;
            let mergeX = sizeX / 200;

            var fillData = xmlDoc.getElementsByTagName('Fill')[0];
            var fillColor = fillData.getElementsByTagName('Color')[0].firstChild.textContent;
            let fillCode = parseInt(fillColor, 10).toString(16).toUpperCase().substring(2);

            var outlineData = xmlDoc.getElementsByTagName('Outline')[0];
            var outlineStroke = outlineData.getElementsByTagName('Color')[0].firstChild.textContent;
            let strokeCode = parseInt(outlineStroke, 10).toString(16).toUpperCase().substring(2);

            var rotationData = xmlDoc.getElementsByTagName('Rotation')[0].firstChild.textContent;

            this.json += `"type": "rect",
            "version": "3.6.6",
            "originX": "left",
            "originY": "top",
            "left": `+ rectLocX +`,
            "top": `+ rectLocY +`,
            "width": 200,
            "height": 100,
            "fill": "#`+ fillCode +`",
            "stroke": "#`+ strokeCode +`",
            "strokeWidth": 2,
            "strokeDashArray": null,
            "strokeLineCap": "butt",
            "strokeDashOffset": 0,
            "strokeLineJoin": "miter",
            "strokeMiterLimit": 4,
            "scaleX": `+ mergeX +`,
            "scaleY": `+ mergeY +`,
            "angle": `+ rotationData +`,
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
          else if(items.childNodes[i].nodeName == 'EllipseData') {
            this.json += `{"type": "circle",
            "version": "3.6.6",
            "originX": "left",
            "originY": "top",
            "left": 10,
            "top": 10,
            "width": 100,
            "height": 100,
            "fill": "#ff5722",
            "stroke": null,
            "strokeWidth": 1,
            "strokeDashArray": null,
            "strokeLineCap": "butt",
            "strokeDashOffset": 0,
            "strokeLineJoin": "miter",
            "strokeMiterLimit": 4,
            "scaleX": 1,
            "scaleY": 1,
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
          }`;
          }
        }
        this.json += `],
        "background": "white"
      }`;
        // this.json = `{"objects": [${rect.innerHTML}]}`;
        // var location = rect.getElementsByTagName('Location')[0].firstChild.textContent;
      };
      reader.readAsText(event.target.files[0]);
    }
    else
    {
      alert('Please select JSON or XML File');
    }
  }


  // saveCanvasToJSON() {
  //   const json = JSON.stringify(this.canvas);
  //   localStorage.setItem('Kanvas', json);
  //   console.log('json');
  //   console.log(json);
  // }

  // loadCanvasFromJSON() {
  //   const CANVAS = localStorage.getItem('jsonData');
  //   console.log('CANVAS');
  //   console.log(CANVAS);

  //   // and load everything from the same json
  //   this.canvas.loadFromJSON(CANVAS, () => {
  //     console.log('CANVAS untar');
  //     console.log(CANVAS);

  //     // making sure to render canvas at the end
  //     this.canvas.renderAll();

  //     // and checking if object's "name" is preserved
  //     console.log('this.canvas.item(0).name');
  //     console.log(this.canvas);
  //   });

  // }

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

  convertDectoHex(s)
    {
      var s = s.toString(16);
      if (s.length == 1)
        s = "0" + s;
      return s;

    }
    
  xmlJson() {

    // remove anchor if xmlJson function is called again 
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
      if (json.objects[i].type == "rect" && json.objects[i].rx == "1" && json.objects[i].fill != "") {
        let height = json.objects[i].height;
        let scaleY = json.objects[i].scaleY;
        let mergeY = height * scaleY;
        
        let width = json.objects[i].width;
        let scaleX = json.objects[i].scaleX;
        let mergeX = width * scaleX;

        //color: hex to dec | for fill and stroke
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
              <Location type="System.String">
                  <![CDATA[`+json.objects[i].left+`,`+json.objects[i].top+`]]>
              </Location>
              <Rotation type="System.Single"><![CDATA[`+json.objects[i].angle+`]]></Rotation>
              <Size type="System.String">
                  <![CDATA[`+mergeX+`,`+mergeY+`]]>
              </Size>
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
      } else if (json.objects[i].type == "rect" && json.objects[i].rx == "0" && json.objects[i].fill == "") {
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
          <Location type="System.String">
              <![CDATA[`+json.objects[i].left+`,`+json.objects[i].top+`]]>
          </Location>
          <Rotation type="System.Single">` + json.objects[i].angle + `</Rotation>
          <Size type="System.String">
              <![CDATA[`+mergeX+`,`+mergeY+`]]>
          </Size>
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
              <Color type="System.Int32">16777215</Color>
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
      } else if (json.objects[i].type == "rect" && json.objects[i].rx == "0" && json.objects[i].fill != "") {
        let height = json.objects[i].height;
        let scaleY = json.objects[i].scaleY;
        let mergeY = height * scaleY;
        
        let width = json.objects[i].width;
        let scaleX = json.objects[i].scaleX;
        let mergeX = width * scaleX;

        //color: hex to dec | for fill and stroke
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
      <Location type="System.String">
          <![CDATA[`+json.objects[i].left+`,`+json.objects[i].top+`]]>
      </Location>
      <Rotation type="System.Single">`+json.objects[i].angle+`</Rotation>
      <Size type="System.String">
          <![CDATA[`+mergeX+`,`+mergeY+`]]>
      </Size>
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
      } else if (json.objects[i].type == "circle") {
        let height = json.objects[i].height;
        let scaleY = json.objects[i].scaleY;
        let mergeY = height * scaleY;

        let width = json.objects[i].width;
        let scaleX = json.objects[i].scaleX;
        let mergeX = width * scaleX;

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
            <Color type="System.Int32">16777215</Color>
          </Fill>
          <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
            <ctor type="System.Int32">3</ctor>
            <Alignment type="System.String"><![CDATA[Center]]></Alignment>
            <Color type="System.Int32">-16777216</Color>
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
      } else if (json.objects[i].type == "i-text" && json.objects[i].fontWeight == "bold" && json.objects[i].fontStyle == "italic") {
        let height = json.objects[i].height;
        let scaleY = json.objects[i].scaleY;
        let mergeY = height * scaleY;

        let width = json.objects[i].width;
        let scaleX = json.objects[i].scaleX;
        let mergeX = width * scaleX;

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
        <Color type="System.Int32">-16777216</Color>
      </FontBrush>
      <Alignment type="System.String"><![CDATA[Near]]></Alignment>
      <LineAlignment type="System.String"><![CDATA[Near]]></LineAlignment>
      <FormatFlags type="System.Int32">0</FormatFlags>
      <Trimming type="System.String"><![CDATA[None]]></Trimming>
      <Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
        <ctor type="System.Int32">0</ctor>
        <Color type="System.Int32">419430655</Color>
      </Fill>
      <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
        <ctor type="System.Int32">3</ctor>
        <Alignment type="System.String"><![CDATA[`+json.objects[i].textAlign+`]]></Alignment>
        <Color type="System.Int32">1258291455</Color>
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
      } else if (json.objects[i].type == "i-text" && json.objects[i].fontWeight == "" && json.objects[i].fontStyle == "normal") {
        let height = json.objects[i].height;
        let scaleY = json.objects[i].scaleY;
        let mergeY = height * scaleY;

        let width = json.objects[i].width;
        let scaleX = json.objects[i].scaleX;
        let mergeX = width * scaleX;

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
        <Color type="System.Int32">-16777216</Color>
      </FontBrush>
      <Alignment type="System.String"><![CDATA[Near]]></Alignment>
      <LineAlignment type="System.String"><![CDATA[Near]]></LineAlignment>
      <FormatFlags type="System.Int32">0</FormatFlags>
      <Trimming type="System.String"><![CDATA[None]]></Trimming>
      <Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
        <ctor type="System.Int32">0</ctor>
        <Color type="System.Int32">419430655</Color>
      </Fill>
      <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
        <ctor type="System.Int32">3</ctor>
        <Alignment type="System.String"><![CDATA[`+json.objects[i].textAlign+`]]></Alignment>
        <Color type="System.Int32">1258291455</Color>
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
      } else if (json.objects[i].type == "i-text" && json.objects[i].fontWeight == "" && json.objects[i].fontStyle == "italic") {
        let height = json.objects[i].height;
        let scaleY = json.objects[i].scaleY;
        let mergeY = height * scaleY;

        let width = json.objects[i].width;
        let scaleX = json.objects[i].scaleX;
        let mergeX = width * scaleX;

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
        <Color type="System.Int32">-16777216</Color>
      </FontBrush>
      <Alignment type="System.String"><![CDATA[Near]]></Alignment>
      <LineAlignment type="System.String"><![CDATA[Near]]></LineAlignment>
      <FormatFlags type="System.Int32">0</FormatFlags>
      <Trimming type="System.String"><![CDATA[None]]></Trimming>
      <Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
        <ctor type="System.Int32">0</ctor>
        <Color type="System.Int32">419430655</Color>
      </Fill>
      <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
        <ctor type="System.Int32">3</ctor>
        <Alignment type="System.String"><![CDATA[`+json.objects[i].textAlign+`]]></Alignment>
        <Color type="System.Int32">1258291455</Color>
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
      } else if (json.objects[i].type == "i-text" && json.objects[i].fontWeight == "bold" && json.objects[i].fontStyle == "normal") {
        let height = json.objects[i].height;
        let scaleY = json.objects[i].scaleY;
        let mergeY = height * scaleY;

        let width = json.objects[i].width;
        let scaleX = json.objects[i].scaleX;
        let mergeX = width * scaleX;

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
        <Color type="System.Int32">-16777216</Color>
      </FontBrush>
      <Alignment type="System.String"><![CDATA[Near]]></Alignment>
      <LineAlignment type="System.String"><![CDATA[Near]]></LineAlignment>
      <FormatFlags type="System.Int32">0</FormatFlags>
      <Trimming type="System.String"><![CDATA[None]]></Trimming>
      <Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush">
        <ctor type="System.Int32">0</ctor>
        <Color type="System.Int32">419430655</Color>
      </Fill>
      <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
        <ctor type="System.Int32">3</ctor>
        <Alignment type="System.String"><![CDATA[`+json.objects[i].textAlign+`]]></Alignment>
        <Color type="System.Int32">1258291455</Color>
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
      } else if (json.objects[i].type == "path") {
        this.xmlData += `
    <FreehandData assembly="Atalasoft.dotImage" namespace="Atalasoft.Annotate">
    <CreationTime type="System.String"><![CDATA[2022-04-07T07:18:15]]></CreationTime>
    <ModifiedTime type="System.String"><![CDATA[2022-04-07T07:18:22]]></ModifiedTime>
    <Location type="System.String"><![CDATA[`+json.objects[i].left+`,`+ json.objects[i].top+`]]></Location>
    <Rotation type="System.Single"><![CDATA[`+json.objects[i].angle+`]]></Rotation>
    <Size type="System.String"><![CDATA[`+json.objects[i].width+`,`+json.objects[i].height+`]]></Size>
    <Visible type="System.Boolean">True</Visible>
    <CanMove type="System.Boolean">True</CanMove>
    <CanResize type="System.Boolean">True</CanResize>
    <CanRotate type="System.Boolean">True</CanRotate>
    <CanMirror type="System.Boolean">True</CanMirror>
    <CanSelect type="System.Boolean">True</CanSelect>
    <ExtraProperties assembly="System" type="System.Collections.Specialized.StringCollection" />
    <Points assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.PointFCollection">
    <Points type="System.String"><![CDATA[0,54.54545,31.81817,40.9091,54.54546,36.36364,131.8182,9.090913,150,4.545456,186.3636,0,200,0,259.0909,0,286.3636,0,300,0,309.0909,0,327.2727,0,336.3636,0,345.4545,0,372.7272,4.545456,377.2726,4.545456,381.8181,4.545456,386.3636,4.545456,390.909,4.545456,395.4545,4.545456,399.9999,4.545456,404.5454,4.545456,409.0908,4.545456,418.1818,4.545456,422.7272,4.545456,427.2727,4.545456,431.8181,4.545456,436.3636,4.545456,440.909,4.545456,445.4545,4.545456,450,4.545456,459.0909,4.545456,463.6363,4.545456,468.1818,4.545456,472.7272,4.545456,481.8181,9.090913,490.909,9.090913,513.6363,13.63637,527.2726,13.63637,545.4544,18.18182,563.6363,22.72727,645.4545,45.45454,659.0908,49.99999,677.2726,54.54545,749.9999,86.36365,754.5452,86.36365,763.6362,90.90908,781.8181,90.90908,786.3635,90.90908,790.9089,90.90908,786.3635,95.45454,781.8181,99.99998,781.8181,104.5454,772.7271,109.0909,754.5452,118.1818,663.6362,145.4545,659.0908,145.4545,604.5453,145.4545,604.5453,140.9091,604.5453,136.3636,604.5453,131.8182,604.5453,127.2727,604.5453,122.7273,609.0908,122.7273,609.0908,113.6364,618.1818,113.6364,618.1818,109.0909,622.7272,109.0909,627.2726,109.0909,631.8181,104.5454,636.3635,104.5454,645.4545,99.99998,681.8181,81.81818,686.3635,77.27273,690.9089,72.72727,699.9999,72.72727,709.0908,72.72727,727.2725,59.0909,740.9089,54.54545,745.4544,54.54545,745.4544,49.99999,754.5452,45.45454,759.0908,40.9091,763.6362,40.9091,772.7271,36.36364,781.8181,36.36364,818.1817,13.63637,827.2726,13.63637,831.8181,9.090913,836.3635,4.545456,840.9089,4.545456,849.9998,4.545456,854.5453,4.545456,854.5453,0,859.0908,0,863.6362,0,872.7272,0,877.2725,0,899.9999,0,904.5452,0,909.0908,0,927.2725,0,931.8181,0,936.3635,0,940.9089,0,959.0908,0,963.6362,0,977.2726,0,981.8181,0,986.3635,0,990.9089,0,999.9998,0,1004.545,0,1009.091,0,1013.636,0,1018.182,0,1022.727,0,1027.272,0,1027.272,4.545456,1031.818,4.545456,1031.818,9.090913,1036.363,9.090913,1036.363,13.63637,1036.363,18.18182,1040.909,18.18182,1045.454,18.18182,1045.454,22.72727]]></Points>
    </Points>
    <Outline assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationPen">
      <ctor type="System.Int32">3</ctor>
      <Alignment type="System.String"><![CDATA[Center]]></Alignment>
      <Color type="System.Int32">-16777216</Color>
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
    <ClosedShape type="System.Boolean">False</ClosedShape>
    <LineType type="System.String"><![CDATA[Straight]]></LineType>
  </FreehandData>`;
      }
    }
    this.xmlData += `</Items>
  </Items>
  </LayerData>
  </LayerDataCollection>
  </rdf:Description>
  </rdf:RDF>
  </x:xmpmeta>`;

    //Download button for XML file
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

    // alert(js2xmlparser.parse("xml", json.objects[0].fill));
    // const creatorTool = json.background;

    // document.getElementById('creatorTool').innerHTML = creatorTool;
    // const data = "in xmlJson";
    // this.xml = data;
    // var json = JSON.parse(this.json);
    // console.log(js2xmlparser.parse("xml", json));
    // console.log(json.objects[0].fill);
    // let obj = {
    //   "firstName": "John",
    //   "lastName": "Smith",
    //   "dateOfBirth": new Date(1964, 7, 26),
    //   "address": {
    //     "@": {
    //       "type": "home"
    //     },
    //     "streetAddress": "3212 22nd St",
    //     "city": "Chicago",
    //     "state": "Illinois",
    //     "zip": 10000
    //   }
    // };

    // console.log(js2xmlparser.parse("person", obj));
  }

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
  }

}
