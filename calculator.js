"use strict"
var stack = [];
window.onload = function () 
{
    var displayVal = "0";
    for (var i in $$('button')) 
	{
        $$('button')[i].onclick = function () 
		{
            var value = $(this).innerHTML;
            
			try
			{
				if(value == "AC")
				{
					displayVal = "0";
					stack = [];
				}
				else if(displayVal == "error")
				{
					throw "An error occured, click AC to continue.";
				}
				else if(value<=9 && value >=0)
				{
					if(displayVal == "0")
					{
						displayVal = value;
					}
					else
					{
						displayVal += value;
					}
				}
				else if(value == ".")
				{
					//We check if there is already a "." into the display value
					if(displayVal.indexOf(".") == -1)//indexOf return -1 if yes
					{
						displayVal += ".";
					}
				}
				else if(value == "(")
				{
					//If the current display value is different than zero
					if(displayVal.match(/^[0-9]+$/) && displayVal != "0")
					{
						stack.push(displayVal);
						displayVal = "0";
					}
					if(stack.length > 0 && stack[stack.length-1].match(/^[0-9]+$/))
					{
						stack.push("*");
					}
					stack.push("(");
				}
				else if(value == ")")
				{
					if(displayVal.match(/^[0-9]+$/))
					{
						stack.push(displayVal);
						displayVal = "0";
					}
					stack.push(")");
				}
				else if(value.match(/^(\+|\-|\*|\/|=)$/))
				{
					//If the "=" button is clicked
					if(value == "=")
					{
						stack.push(displayVal);
						if(isValidExpression(stack))
						{
							displayVal = postfixCalculate(infixToPostfix(stack));
							
							//We clear the stack
							while(stack.length > 0)
							{
								stack.splice(stack.length-1,1);
							}
							
						}
						else
						{
							displayVal = "error";
							throw "expression not valid";
						}
					}
					//If another operator button is clicked
					else
					{
						if(displayVal.match(/^[0-9]+(\.[0-9]+)?$/))
						{
							stack.push(displayVal);
							displayVal = "0";
						}
						stack.push(value);
					}
					
					
				}
			}
			catch(e)
			{
				alert();
			}
			
			if(stack.length == 0)
			{
				$('expression').innerHTML = "0";
			}
			else
			{
				$('expression').innerHTML = stack.join(" ");
			}
            
			$('result').innerHTML = displayVal;
        };
    }
}
function isValidExpression(s) 
{
	var opening = 0;
	var closing = 0;
	
	for(var i=0;i<stack.length;i++)
	{
		if(stack[i] == "(")
		{
			opening++;
		}
		else if(stack[i] == ")")
		{
			closing++;
		}
	}
	
	if(opening==closing)
	{
		return true;
	}
	else
	{
		return false;
	}

}
/*
infixToPostfix takes a stack in input like: ['3','+','2','*','5']
and return a new stack differently ordered: ['3','2','5','*','+']
Then we will compute at first '2'*'5'
and then the result + '3'
*/
function infixToPostfix(s) 
{
    var priority = {
        "+":0,
        "-":0,
        "*":1,
        "/":1
    };
    var tmpStack = [];
    var result = [];
    for(var i =0; i<stack.length ; i++) 
	{
        if(/^[0-9]+$/.test(s[i]))
		{
            result.push(s[i]);
        } 
		else 
		{
            if(tmpStack.length === 0)
			{
                tmpStack.push(s[i]);
            } 
			else 
			{
                if(s[i] === ")")
				{
                    while (true) 
					{
                        if(tmpStack.last() === "(")
						{
                            tmpStack.pop();
                            break;
                        } else 
						{
                            result.push(tmpStack.pop());
                        }
                    }
                    continue;
                }
                if(s[i] ==="(" || tmpStack.last() === "(")
				{
                    tmpStack.push(s[i]);
                } 
				else 
				{
                    while(priority[tmpStack.last()] >= priority[s[i]])
					{
                        result.push(tmpStack.pop());
                    }
                    tmpStack.push(s[i]);
                }
            }
        }
    }
    for(var i = tmpStack.length; i > 0; i--)
	{
        result.push(tmpStack.pop());
    }
    return result;
}
function postfixCalculate(s) 
{
	var newStack = [];
	var count = 0;
	var tmp;
	var tmp2;
	
	while(count < s.length)
	{
		//alert("loop number"+count+" s = "+s[count]);
		
		if(s[count].match(/^[0-9]+(\.[0-9]+)?$/))
		{
			newStack.push(s[count]);
			count++;
		}
		else if(count<2)
		{//If there are not enouth numbers to compute
			return "error"//we get out of the loop
		}
		else
		{
			tmp = parseInt(newStack[newStack.length-1]);
			tmp2 = parseInt(newStack[newStack.length-2]);
			
			switch(s[count])
			{
				case "+": tmp = tmp2+tmp;
				break;
				case "-": tmp = tmp2-tmp;
				break;
				case "*": tmp = tmp2*tmp;
				break;
				case "/": tmp = tmp2/tmp;
				break;
			}
			newStack.splice(newStack.length-1, 1);
			newStack[newStack.length-1] = tmp;

			count++;
		}
	}
	
	if(newStack.length>1)
	{		
		return "error";
	}
	else
	{
		return newStack[0];
	}
	
}
