import {
  Component,
  ViewChild
} from '@angular/core';
import {
  FabricjsEditorComponent
} from 'projects/angular-editor-fabric-js/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-editor-fabric-js';

  @ViewChild('canvas', {
    static: false
  }) canvas: FabricjsEditorComponent;

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

  // public saveCanvasToJSON() {
  //   this.canvas.saveCanvasToJSON();
  // }

  // public loadCanvasFromJSON() {
  //   this.canvas.loadCanvasFromJSON();
  // }

  public convertHextoDec(s) {
    this.canvas.convertHextoDec(s);
  }

  public convertDectoHex(s) {
    this.canvas.convertDectoHex(s);
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

  public addImageOnCanvas(url, renderInBack) {
    this.canvas.addImageOnCanvas(url, renderInBack);
  }

  public xmlJson() {
    this.canvas.xmlJson();
  }

  public readUrl(event) {
    this.canvas.readUrl(event);
  }

  public readJson(event) {
    this.canvas.readJson(event);
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

  public setBorderFill() {
    this.canvas.setBorderFill();
  }

  public setBgFill() {
    this.canvas.setBgFill();
  }

  public canvasRead() {
    this.canvas.canvasRead();
  }

  public canvasWrite() {
    this.canvas.canvasWrite();
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
