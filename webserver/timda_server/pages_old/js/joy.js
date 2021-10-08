/*
 * Name          : joy.js
 * @author       : Roberto D'Amico (Bobboteck)
 * Last modified : 09.06.2020
 * Revision      : 1.1.6
 *
 * Modification History:
 * Date         Version     Modified By		Description
 * 2020-06-09	1.1.6		Roberto D'Amico	Fixed Issue #10 and #11
 * 2020-04-20	1.1.5		Roberto D'Amico	Correct: Two sticks in a row, thanks to @liamw9534 for the suggestion
 * 2020-04-03               Roberto D'Amico Correct: InternalRadius when change the size of canvas, thanks to @vanslipon for the suggestion
 * 2020-01-07	1.1.4		Roberto D'Amico Close #6 by implementing a new parameter to set the functionality of auto-return to 0 position
 * 2019-11-18	1.1.3		Roberto D'Amico	Close #5 correct indication of East direction
 * 2019-11-12   1.1.2       Roberto D'Amico Removed Fix #4 incorrectly introduced and restored operation with touch devices
 * 2019-11-12   1.1.1       Roberto D'Amico Fixed Issue #4 - Now JoyStick work in any position in the page, not only at 0,0
 * 
 * The MIT License (MIT)
 *
 *  This file is part of the JoyStick Project (https://github.com/bobboteck/JoyStick).
 *	Copyright (c) 2015 Roberto D'Amico (Bobboteck).
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
 
/**
 * @desc Principal object that draw a joystick, you only need to initialize the object and suggest the HTML container
 * @costructor
 * @param container {String} - HTML object that contains the Joystick
 * @param parameters (optional) - object with following keys:
 *	title {String} (optional) - The ID of canvas (Default value is 'joystick')
 * 	width {Int} (optional) - The width of canvas, if not specified is setted at width of container object (Default value is the width of container object)
 * 	height {Int} (optional) - The height of canvas, if not specified is setted at height of container object (Default value is the height of container object)
 * 	internalFillColor {String} (optional) - Internal color of Stick (Default value is '#00AA00')
 * 	internalLineWidth {Int} (optional) - Border width of Stick (Default value is 2)
 * 	internalStrokeColor {String}(optional) - Border color of Stick (Default value is '#003300')
 * 	externalLineWidth {Int} (optional) - External reference circonference width (Default value is 2)
 * 	externalStrokeColor {String} (optional) - External reference circonference color (Default value is '#008000')
 * 	autoReturnToCenter {Bool} (optional) - Sets the behavior of the stick, whether or not, it should return to zero position when released (Default value is True and return to zero)
 */
var JoyStick = (function(container, parameters)
{
  parameters = parameters || {};
  var title = (typeof parameters.title === "undefined" ? "joystick" : parameters.title),
    width = (typeof parameters.width === "undefined" ? 0 : parameters.width),
    height = (typeof parameters.height === "undefined" ? 0 : parameters.height),
    internalFillColor = (typeof parameters.internalFillColor === "undefined" ? "#00AA00" : parameters.internalFillColor),
    internalLineWidth = (typeof parameters.internalLineWidth === "undefined" ? 2 : parameters.internalLineWidth),
    internalStrokeColor = (typeof parameters.internalStrokeColor === "undefined" ? "#003300" : parameters.internalStrokeColor),
    externalLineWidth = (typeof parameters.externalLineWidth === "undefined" ? 2 : parameters.externalLineWidth),
    externalStrokeColor = (typeof parameters.externalStrokeColor ===  "undefined" ? "#008000" : parameters.externalStrokeColor),
    autoReturnToCenter = (typeof parameters.autoReturnToCenter === "undefined" ? true : parameters.autoReturnToCenter);
  
  // Create Canvas element and add it in the Container object
  var objContainer = document.getElementById(container);
  var canvas = document.createElement("canvas");
  canvas.id = title;
  if(width === 0) { width = objContainer.clientWidth; }
  if(height === 0) { height = objContainer.clientHeight; }
  canvas.width = width;
  canvas.height = height;
  objContainer.appendChild(canvas);
  var context=canvas.getContext("2d");
  
  var pressed = 0;
  var circumference = 2 * Math.PI;
  var internalRadius = (canvas.width-((canvas.width/2)+0))/2;
  var maxMoveStick = internalRadius;
  var externalRadius = internalRadius + 30;
  // var externalRadius = Math.max(canvas.width/2, canvas.height/2) - externalLineWidth;
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var directionHorizontalLimitPos = canvas.width / 10;
  var directionHorizontalLimitNeg = directionHorizontalLimitPos * -1;
  var directionVerticalLimitPos = canvas.height / 10;
  var directionVerticalLimitNeg = directionVerticalLimitPos * -1;
  // Used to save current position of stick
  var movedX=centerX;
  var movedY=centerY;
  var movedAng = 0;
 
  // Check if the device support the touch or not
  canvas.addEventListener("touchstart", onTouchStart, false);
  canvas.addEventListener("touchend", onTouchEnd, false);
  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mousemove", onMouseMove, false);
  canvas.addEventListener("mouseup", onMouseUp, false);
  canvas.addEventListener("mouseout", onMouseUp, false);

  // Draw the object
  drawExternal();
  drawInternal();

  /******************************************************
   * Private methods
   *****************************************************/

  /**
   * @desc Draw the external circle used as reference position
   */
  function drawExternal()
  {
    context.beginPath();
    context.arc(centerX, centerY, externalRadius, 0, circumference, false);
    context.lineWidth = externalLineWidth;
    context.strokeStyle = externalStrokeColor;
    context.stroke();
  }

  /**
   * @desc Draw the internal stick in the current position the user have moved it
   */
  function drawInternal()
  {
    context.beginPath();
    if(movedX<internalRadius) { movedX=maxMoveStick; }
    if((movedX+internalRadius) > canvas.width) { movedX = canvas.width-(maxMoveStick); }
    if(movedY<internalRadius) { movedY=maxMoveStick; }
    if((movedY+internalRadius) > canvas.height) { movedY = canvas.height-(maxMoveStick); }
    context.arc(movedX, movedY, internalRadius, 0, circumference, false);
    // create radial gradient
    var grd = context.createRadialGradient(centerX, centerY, 5, centerX, centerY, 200);
    // Light color
    grd.addColorStop(0, internalFillColor);
    // Dark color
    grd.addColorStop(1, internalStrokeColor);
    context.fillStyle = grd;
    context.fill();
    context.lineWidth = internalLineWidth;
    context.strokeStyle = internalStrokeColor;
    context.stroke();
  }
  /**
   * For right-clicked
   */
  function drawInternal2()
  {
    if(movedX<internalRadius) { movedX=maxMoveStick; }
    if((movedX+internalRadius) > canvas.width) { movedX = canvas.width-(maxMoveStick); }
    if(movedY<internalRadius) { movedY=maxMoveStick; }
    if((movedY+internalRadius) > canvas.height) { movedY = canvas.height-(maxMoveStick); }
    var rx = (100*((movedX - centerX)/maxMoveStick)).toFixed();
    var ry = (100*((movedY - centerY)/maxMoveStick)*-1).toFixed();
    var radius = Math.sqrt(Math.pow(rx, 2) + Math.pow(ry, 2));
    var angle = Math.atan2(rx, ry)*-1;
    if (radius > externalRadius) {radius=externalRadius;}
    context.beginPath();
    context.moveTo(centerX, centerY);
    if (rx < 0) {
        context.arc(centerX, centerY, radius, -1*angle+1.5*Math.PI, 1.5*Math.PI, false);
    } else {
        context.arc(centerX, centerY, radius, 1.5*Math.PI, -1*angle+1.5*Math.PI, false);
    }
    movedAng = angle * (180 / Math.PI);
    context.closePath();
    context.fillStyle = '#FFCEBE';
    context.fill();
    
  }
  
  /**
   * For gamepad
   */
  function drawInternal3(x, y, z)
  {
    dx = centerX + x;
    dy = centerY + y;
    context.beginPath();
    if(dx<internalRadius) { dx=maxMoveStick; }
    if((dx+internalRadius) > canvas.width) { dx= canvas.width-(maxMoveStick); }
    if(dy<internalRadius) { dy=maxMoveStick; }
    if((dy+internalRadius) > canvas.height) { dy= canvas.height-(maxMoveStick); }
    // context.arc(centerX/2 + x, centerY/2 + y, internalRadius, 0, circumference, false);
    context.arc(dx, dy, internalRadius, 0, circumference, false);
    // create radial gradient
    var grd = context.createRadialGradient(centerX, centerY, 5, centerX, centerY, 200);
    // Light color
    grd.addColorStop(0, internalFillColor);
    // Dark color
    grd.addColorStop(1, internalStrokeColor);
    context.fillStyle = grd;
    context.fill();
    context.lineWidth = internalLineWidth;
    context.strokeStyle = internalStrokeColor;
    context.stroke();

    // var rx = (100*((dx - centerX)/maxMoveStick)).toFixed();
    // var ry = (100*((dy - centerY)/maxMoveStick)*-1).toFixed();
    // var radius = Math.sqrt(Math.pow(rx, 2) + Math.pow(ry, 2));
    var radius = Math.abs(z);
    var angle = Math.sign(z)*-3.24159;
    if (radius > externalRadius) {radius=externalRadius;}
    context.beginPath();
    context.moveTo(centerX, centerY);
    if (angle < 0) {
        context.arc(centerX, centerY, radius, -1*angle+1.5*Math.PI, 1.5*Math.PI, false);
    } else {
        context.arc(centerX, centerY, radius, 1.5*Math.PI, -1*angle+1.5*Math.PI, false);
    }
    movedAng = angle * (180 / Math.PI);
    context.closePath();
    // context.fillStyle = '#FFCEBE';
    context.fillStyle = 'rgba(255, 206, 190, 0.8)';
    context.fill();
  }
  /**
   * @desc Events for manage touch
   */
  function onTouchStart(event) 
  {
    // Left Clicked
    if (event.button == 0) {
      pressed = 1;
    // Right Clicked
    }else if(event.button == 2) {
      pressed = 2;
    // Center Clicked is equal to 1
    }else {
      pressed = 0;
    }
  }

  function onTouchMove(event)
  {
    // Prevent the browser from doing its default thing (scroll, zoom)
    event.preventDefault();
    if(pressed === 1 && event.targetTouches[0].target === canvas)
    {
      movedX = event.targetTouches[0].pageX;
      movedY = event.targetTouches[0].pageY;
      // Manage offset
      if(canvas.offsetParent.tagName.toUpperCase() === "BODY")
      {
        movedX -= canvas.offsetLeft;
        movedY -= canvas.offsetTop;
      }
      else
      {
        movedX -= canvas.offsetParent.offsetLeft;
        movedY -= canvas.offsetParent.offsetTop;
      }
      // Delete canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Redraw object
      drawExternal();
      drawInternal();
    }
  } 

  function onTouchEnd(event) 
  {
    pressed = 0;
    // If required reset position store variable
    if(autoReturnToCenter)
    {
      movedX = centerX;
      movedY = centerY;
    }
    // Delete canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw object
    drawExternal();
    drawInternal();
    //canvas.unbind('touchmove');
  }

  /**
   * @desc Events for manage mouse
   */
  function onMouseDown(event) 
  {
    // console.log("Mouse down event: " + event.button);
    // Left Clicked
    if (event.button == 0) {
      pressed = 1;
    // Right Clicked
    }else if(event.button == 2) {
      pressed = 2;
    // Center Clicked is equal to 1
    }else {
      pressed = 0;
    }
  }

  function onMouseMove(event) 
  {
    if(pressed === 1)
    {
      movedX = event.pageX;
      movedY = event.pageY;
      // Manage offset
      if(canvas.offsetParent.tagName.toUpperCase() === "BODY")
      {
        movedX -= canvas.offsetLeft;
        movedY -= canvas.offsetTop;
      }
      else
      {
        movedX -= canvas.offsetParent.offsetLeft;
        movedY -= canvas.offsetParent.offsetTop;
      }
      // Delete canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Redraw object
      drawExternal();
      drawInternal();
    }
    if(pressed === 2)
    {
      movedX = event.pageX;
      movedY = event.pageY;
      // Manage offset
      if(canvas.offsetParent.tagName.toUpperCase() === "BODY")
      {
        movedX -= canvas.offsetLeft;
        movedY -= canvas.offsetTop;
      }
      else
      {
        movedX -= canvas.offsetParent.offsetLeft;
        movedY -= canvas.offsetParent.offsetTop;
      }
      // Delete canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Redraw object
      drawExternal();
      // drawInternal();
      drawInternal2();
    }
  }

  function onMouseUp(event) 
  {
    pressed = 0;
    // If required reset position store variable
    if(autoReturnToCenter)
    {
      movedX = centerX;
      movedY = centerY;
    }
    // Delete canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw object
    drawExternal();
    drawInternal();
    //canvas.unbind('mousemove');
  }

  /******************************************************
   * Public methods
   *****************************************************/
  
  /**
   * @desc The width of canvas
   * @return Number of pixel width 
   */
  this.GetWidth = function () 
  {
    return canvas.width;
  };
  
  /**
   * @desc The height of canvas
   * @return Number of pixel height
   */
  this.GetHeight = function () 
  {
    return canvas.height;
  };
  
  /**
   * @desc The X position of the cursor relative to the canvas that contains it and to its dimensions
   * @return Number that indicate relative position
   */
  this.GetPosX = function ()
  {
    return movedX;
  };
  
  /**
   * @desc The Y position of the cursor relative to the canvas that contains it and to its dimensions
   * @return Number that indicate relative position
   */
  this.GetPosY = function ()
  {
    return movedY;
  };
  
  /**
   * @desc Normalizzed value of X move of stick
   * @return Integer from -100 to +100
   */
  this.GetX = function ()
  {
    return (100*((movedX - centerX)/maxMoveStick)).toFixed();
  };

  /**
   * @desc Normalizzed value of Y move of stick
   * @return Integer from -100 to +100
   */
  this.GetY = function ()
  {
    return ((100*((movedY - centerY)/maxMoveStick))*-1).toFixed();
  };
  
  /**
   * @desc Get the direction of the cursor as a string that indicates the cardinal points where this is oriented
   * @return String of cardinal point N, NE, E, SE, S, SW, W, NW and C when it is placed in the center
   */
  this.GetDir = function()
  {
    var result = "";
    var orizontal = movedX - centerX;
    var vertical = movedY - centerY;
    
    if(vertical >= directionVerticalLimitNeg && vertical <= directionVerticalLimitPos)
    {
      result = "C";
    }
    if(vertical < directionVerticalLimitNeg)
    {
      result = "N";
    }
    if(vertical > directionVerticalLimitPos)
    {
      result = "S";
    }
    
    if(orizontal < directionHorizontalLimitNeg)
    {
      if(result === "C")
      { 
        result = "W";
      }
      else
      {
        result += "W";
      }
    }
    if(orizontal > directionHorizontalLimitPos)
    {
      if(result === "C")
      { 
        result = "E";
      }
      else
      {
        result += "E";
      }
    }
    
    return result;
  };

  /**
   * @desc Get variable 'pressed' to detect joystick movement
   * @return value of pressed
   */
  this.GetPressed = function ()
  {
    return pressed;
  };

  /**
   * @desc the value of Angle of stick when pressed stick w/ right click
   * @return Integer from -180 to +180
   */
  this.GetAng = function ()
  {
    return movedAng;
  };

  /**
   * @desc Set param: autoReturnToCenter
   */
  this.SetReturnToCenter = function (c)
  {
    autoReturnToCenter = c;
    if (!c) {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseout", onMouseUp);
    }else {
      canvas.addEventListener("mousedown", onMouseDown, false);
      canvas.addEventListener("mousemove", onMouseMove, false);
      canvas.addEventListener("mouseup", onMouseUp, false);
      canvas.addEventListener("mouseout", onMouseUp, false);
    }
  };

  /**
   * @desc Draw joystick with specfic position
   */
  this.DrawJoy = function (x, y, z)
  {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawExternal();
    drawInternal3(x, y, z);
  };
});
