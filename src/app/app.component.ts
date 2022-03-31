import { Component, ViewChild } from '@angular/core';
import { FabricjsEditorComponent } from 'projects/angular-editor-fabric-js/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-editor-fabric-js';
  
  @ViewChild('canvas', {static: false}) canvas: FabricjsEditorComponent;

  
  data= '<?xml version="1.0" encoding="utf-8"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:xmp="http://ns.abobe.com/xap/1.0/"><xmp:CreatorTool id="creatorTool">Atalasoft DotAnnotate 11.2</xmp:CreatorTool><xmp:CreateDate><![CDATA[2022-03-08T02:19:13]]></xmp:CreateDate></rdf:Description><rdf:Description rdf:about="DotAnnotate Annotations" xmlns:xmp="http://ns.abobe.com/xap/4.0/"><DocumentResolution>1,1</DocumentResolution><LayerDataCollection><LayerData assembly="Atalasoft.dotImage" namespace="Atalasoft.Annotate"><CreationTime type="System.String"><![CDATA[2022-03-08T02:19:12]]></CreationTime><ModifiedTime type="System.String"><![CDATA[2022-03-08T02:19:12]]></ModifiedTime><Location type="System.String"><![CDATA[359.0909,245.4545]]></Location><Rotation type="System.Single">0</Rotation><Size type="System.String"><![CDATA[404.5454,259.0909]]></Size><Visible type="System.Boolean">True</Visible><CanMove type="System.Boolean">True</CanMove><CanResize type="System.Boolean">True</CanResize><CanRotate type="System.Boolean">False</CanRotate><CanMirror type="System.Boolean">False</CanMirror><CanSelect type="System.Boolean">True</CanSelect><ExtraProperties assembly="System" type="System.Collections.Specialized.StringCollection" /><GroupAnnotation type="System.Boolean">False</GroupAnnotation><Items assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationDataCollection"><Items type="System.Collections.ArrayList"><RectangleData assembly="Atalasoft.dotImage" namespace="Atalasoft.Annotate"><CreationTime type="System.String"><![CDATA[2022-03-08T02:19:11]]></CreationTime><ModifiedTime type="System.String"><![CDATA[2022-03-08T02:19:12]]></ModifiedTime><Location type="System.String"><![CDATA[359.0909,245.4545]]></Location><Rotation type="System.Single">0</Rotation><Size type="System.String"><![CDATA[404.5454,259.0909]]></Size><Visible type="System.Boolean">True</Visible><CanMove type="System.Boolean">True</CanMove><CanResize type="System.Boolean">True</CanResize><CanRotate type="System.Boolean">True</CanRotate><CanMirror type="System.Boolean">True</CanMirror><CanSelect type="System.Boolean">True</CanSelect><ExtraProperties assembly="System" type="System.Collections.Specialized.StringCollection" /><Fill assembly="Atalasoft.dotImage" type="Atalasoft.Annotate.AnnotationBrush"><ctor type="System.Int32">0</ctor><Color type="System.Int32">-16777216</Color></Fill><Translucent type="System.Boolean">False</Translucent></RectangleData></Items></Items></LayerData></LayerDataCollection></rdf:Description></rdf:RDF></x:xmpmeta>';
  
  router: any;

  public rasterize() {
    this.canvas.rasterize();
  }

  public rasterizeSVG() {
    this.canvas.rasterizeSVG();
  }

  public zoomInCanvas() {
    this.canvas.zoomInCanvas();
  }

  public zoomOutCanvas() {
    this.canvas.zoomOutCanvas();
  }

  public freeDraw() {
    this.canvas.freeDraw();
  }

  public moveSelectedObj() {
    this.canvas.moveSelectedObj();
  }

  public UploadImg() {
    this.canvas.UploadImg();
  }

  public saveCanvasToJSON() {
    this.canvas.saveCanvasToJSON();
  }

  public loadCanvasFromJSON() {
    this.canvas.loadCanvasFromJSON();
  }

  public confirmClear() {
    this.canvas.confirmClear();
  }

  public changeSize() {
    this.canvas.changeSize();
  }

  public addText() {
    this.canvas.addText();
  }

  public getImgPolaroid(event) {
    this.canvas.getImgPolaroid(event);
  }

  public addImageOnCanvas(url,renderInBack) {
    this.canvas.addImageOnCanvas(url,renderInBack);
  }

  public xmlJson() {
    this.canvas.xmlJson();
  }

  public readUrl(event) {
    this.canvas.readUrl(event);
  }

  public removeWhite(url) {
    this.canvas.removeWhite(url);
  }

  public addFigure(figure) {
    this.canvas.addFigure(figure);
  }

  public removeSelected() {
    this.canvas.removeSelected();
  }

  public sendToBack() {
    this.canvas.sendToBack();
  }

  public bringToFront() {
    this.canvas.bringToFront();
  }

  public clone() {
    this.canvas.clone();
  }

  public cleanSelect() {
    this.canvas.cleanSelect();
  }

  public setCanvasFill() {
    this.canvas.setCanvasFill();
  }

  public setCanvasImage() {
    this.canvas.setCanvasImage();
  }

  public setId() {
    this.canvas.setId();
  }

  public setOpacity() {
    this.canvas.setOpacity();
  }

  public setFill() {
    this.canvas.setFill();
  }

  public setFontFamily() {
    this.canvas.setFontFamily();
  }

  public setTextAlign(value) {
    this.canvas.setTextAlign(value);
  }

  public setBold() {
    this.canvas.setBold();
  }

  public setFontStyle() {
    this.canvas.setFontStyle();
  }

  public hasTextDecoration(value) {
    this.canvas.hasTextDecoration(value);
  }

  public setTextDecoration(value) {
    this.canvas.setTextDecoration(value);
  }

  public setFontSize() {
    this.canvas.setFontSize();
  }

  public setLineHeight() {
    this.canvas.setLineHeight();
  }

  public setCharSpacing() {
    this.canvas.setCharSpacing();
  }

  public rasterizeJSON() {
    this.canvas.rasterizeJSON();
  }
}
