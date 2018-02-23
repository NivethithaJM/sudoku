/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var displayArray=[];
var questionTray1=[
                    [7,9,0, 0,0,0, 3,0,0],
                    [0,0,0, 0,0,6, 9,0,0],
                    [8,0,0, 0,3,0, 0,7,6],
                    [0,0,0, 0,0,5, 0,0,2],
                    [0,0,5, 4,1,8, 7,0,0],
                    [4,0,0, 7,0,0, 0,0,0],
                    [6,1,0, 0,9,0, 0,0,8],
                    [0,0,2, 3,0,0, 0,0,0],
                    [0,0,9, 0,0,0, 0,5,4]
                ];
var questionTray=[
                    [0,0,0, 0,5,8, 0,0,2],
                    [1,3,0, 0,2,0, 5,4,0],
                    [0,2,0, 0,0,3, 7,6,0],
                    [4,5,0, 3,0,0, 0,0,0],
                    [0,0,7, 5,0,9, 3,0,0],
                    [0,0,0, 0,0,7, 0,5,6],
                    [0,4,5, 6,0,0, 0,1,0],
                    [0,6,2, 0,1,0, 0,9,7],
                    [7,0,0, 9,3,0, 0,0,0]
                ];
var answerArray;
var vacPos=0;
var curFocusDiv=null;
var sudoku=new function()
{
    this.initAnswerArray=function()
    {
        answerArray=JSON.parse(JSON.stringify(questionTray));
    };
    this.initDisplay=function()
    {
    var myBoard=document.getElementById('myBoard');
    for(var j=0;j<9;j++)
    {
        displayArray[j]=[];
        for(var i=0;i<9;i++)
        {
            var tt=document.createElement('div');
            tt.setAttribute("class","floating-box");
            if(i===2 || i===5)
            {
                sudoku.addClass(tt,"floating-box-right");
            }
            if(i===3 || i===6)
            {
                sudoku.addClass(tt,"floating-box-left");
            }
            if(j===2 || j===5)
            {
                sudoku.addClass(tt,"floating-box-bottom");
            }
            if(j===3 || j===6)
            {
                sudoku.addClass(tt,"floating-box-top");
            }
            tt.setAttribute("onclick","sudoku.focusDiv(this,event);");
            myBoard.appendChild(tt);
            
            displayArray[j][i]=tt;
        }
        myBoard.appendChild(document.createElement('br'));
    }
    sudoku.showDisplay();
    sudoku.initAnswerArray();
    };
    this.addClass=function(el,clName)
    {
        var curClass=el.getAttribute("class");
        if(curClass.indexOf(clName) === -1) el.setAttribute("class",curClass+" "+clName);
    };
    this.removeClass=function(el,clName)
    {
        var curClass=el.getAttribute("class");
        el.setAttribute("class",curClass.replace(clName,""));
    };
    this.showDisplay=function()
    {
    for(var i=0;i<9;i++)
    {
        for(var j=0;j<9;j++)
        {
            if(questionTray[i][j]!==0)
            {
                displayArray[i][j].innerHTML=questionTray[i][j];
                sudoku.addClass(displayArray[i][j],"read-only-box");                
            }
            else 
            {
                displayArray[i][j].innerHTML="";
                vacPos++;
                sudoku.addClass(displayArray[i][j],"edit-box");
            }
            displayArray[i][j].setAttribute("_row",i);
            displayArray[i][j].setAttribute("_column",j);   
        }
    }
    };
    this.focusDiv=function(el,event)
    {
        if(!sudoku.isEditable(el)) return;
        if(!curFocusDiv) curFocusDiv=el;
        sudoku.removeClass(curFocusDiv,"edit-box-focus");
        sudoku.addClass(el,"edit-box-focus");
        curFocusDiv=el;
    };
    this.isEditable=function(el)
    {
        var row=el.getAttribute("_row");
        var col=el.getAttribute("_column");
        if(questionTray[row][col]!==0)return false;
        else return true;
    };
    this.processEvent=function(event)
    {
        if(!curFocusDiv) return;
        var number=0;
        var x=event.which;
        switch(x)
        {
            case 49:
                number=1;
                break;
            case 50:
                number=2;
                break;
            case 51:
                number=3;
                break;
            case 52:
                number=4;
                break;
            case 53:
                number=5;
                break;
            case 54:
                number=6;
                break;
            case 55:
                number=7;
                break;
            case 56:
                number=8;
                break;
            case 57:
                number=9;
                break;
            case 8:
                number=-1;
                break;
            case 46:
                number=-1;
                break;
        }
        if(number===0)return;
        var currRow=curFocusDiv.getAttribute("_row");
        var currcol=curFocusDiv.getAttribute("_column");
        var checkNumber=answerArray[currRow][currcol];
        if(checkNumber===number)return;
        if(number!==-1)
        {
            answerArray[currRow][currcol]=number;
            curFocusDiv.innerHTML=number;
            vacPos--;
        }
        else
        {
           answerArray[currRow][currcol]= 0;
           curFocusDiv.innerHTML="";
           vacPos++;
        }
        sudoku.removeClass(displayArray[currRow][currcol],"edit-box-wrong");
        sudoku.checkHorizontalLine(currRow,currcol,checkNumber);
        sudoku.checkVerticalLine(currRow,currcol,checkNumber);
        sudoku.checkBox(currRow,currcol,checkNumber);
        if(vacPos===0 && sudoku.validate())
        {
            alert("YOU WON ! CLICK OK TO START AGAIN");
            sudoku.initDisplay();
        }
    };
    this.checkHorizontalLine=function(currRow,currcol,checkNumber)
    {
        var checkNumberOcurrence=0;
        var cnFRow=-1;
        var cnFCol=-1;
        for(var i=0;i<9;i++)
        {
            if(checkNumber!==0 && checkNumber===answerArray[currRow][i])
            {
                cnFRow=currRow;
                cnFCol=i;
                checkNumberOcurrence+=1;
            }
            if(new String(i).valueOf()!==new String(currcol).valueOf() && answerArray[currRow][i]!==0 && answerArray[currRow][i]===answerArray[currRow][currcol])
            {
                sudoku.addClass(displayArray[currRow][i],"edit-box-wrong");
                sudoku.addClass(displayArray[currRow][currcol],"edit-box-wrong");
            }
        }
        if(checkNumberOcurrence!==0)
        {
            sudoku.removeClass(displayArray[cnFRow][cnFCol],"edit-box-wrong");
            sudoku.checkHorizontalLine(cnFRow,cnFCol,0);
        }
        
    };
    this.checkVerticalLine=function(currRow,currcol,checkNumber)
    {
        var checkNumberOcurrence=0;
        var cnFRow=-1;
        var cnFCol=-1;
        for(var i=0;i<9;i++)
        {
            if(checkNumber!==0 && checkNumber===answerArray[i][currcol])
            {
                cnFRow=i;
                cnFCol=currcol;
                checkNumberOcurrence+=1;
            }
            if(new String(i).valueOf()!==new String(currRow).valueOf() && answerArray[i][currcol]!==0 && answerArray[i][currcol]===answerArray[currRow][currcol])
            {
                sudoku.addClass(displayArray[i][currcol],"edit-box-wrong");
                sudoku.addClass(displayArray[currRow][currcol],"edit-box-wrong");
            }
        }
        if(checkNumberOcurrence!==0)
        {
            sudoku.removeClass(displayArray[cnFRow][cnFCol],"edit-box-wrong");
            sudoku.checkVerticalLine(cnFRow,cnFCol,0);
        }
    };
    this.checkBox=function(currRow,currcol,checkNumber)
    {
        var gridArray=[ [0,1,2],
                        [0,1,2],
                        [0,1,2],
                        [3,4,5],
                        [3,4,5],
                        [3,4,5],
                        [6,7,8],
                        [6,7,8],
                        [6,7,8]
                      ];
        const i=gridArray[currRow];
        const j=gridArray[currcol];
        var checkNumberOcurrence=0;
        var cnFRow=-1;
        var cnFCol=-1;
        for(var k=0;k<3;k++)
        {
        for(var l=0;l<3;l++)
        {
            if(checkNumber!==0 && checkNumber===answerArray[i[k]][j[l]])
            {
                cnFRow=i[k];
                cnFCol=j[l];
                checkNumberOcurrence+=1;
            }
            if(new String(i[k]).valueOf()!==new String(currRow).valueOf()&& new String(j[l]).valueOf()!==new String(currcol).valueOf() && answerArray[i[k]][j[l]]!==0 && answerArray[i[k]][j[l]]===answerArray[currRow][currcol])
            {
                sudoku.addClass(displayArray[i[k]][j[l]],"edit-box-wrong");
                sudoku.addClass(displayArray[currRow][currcol],"edit-box-wrong");
            }
        }
        }
        if(checkNumberOcurrence!==0)
        {
            sudoku.removeClass(displayArray[cnFRow][cnFCol],"edit-box-wrong");
            sudoku.checkVerticalLine(cnFRow,cnFCol,0);
        }
    };
    this.sortNumber=function(a,b) 
    {
    return a - b;
    };

    this.validate=function()
    {
    for(var i=0;i<9;i++)
        {
        var colArry=[];
        var rowArry=[];
        for(var j=0;j<9;j++)
            {
              colArry.push(answerArray[j][i]);
              rowArry.push(answerArray[i][j]);
            }
        colArry=colArry.sort(sudoku.sortNumber);
        rowArry=rowArry.sort(sudoku.sortNumber);
        for(var j=0;j<9;j++)
        {
            if(colArry[j]!==j+1 || rowArry[j]!==j+1)
            {
                return false;
            }
        }
        }
    return true;
    };
};