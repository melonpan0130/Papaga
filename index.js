// 전역변수 
var lang_status = 1; // 1: 암호화, 2:복호화

// 평문, 암호문중에서 무엇을 작성할지 선택
function selectLang(no, lang)
{
    var other;
    
    if(no=="Dec1") other="Dec2";
    else other="Dec1";
    
    var no_inner = document.getElementById(no);
    var other_inner = document.getElementById(other);
    var button = document.getElementById("EncButton");

    if(lang==2){
        no_inner.innerHTML = "평문";
        other_inner.innerHTML = "암호문";
        button.innerHTML = "암호화하기";
        lang_status = 1;
    } else if(lang==1){
        no_inner.innerHTML = "암호문";
        other_inner.innerHTML = "평문";
        button.innerHTML = "복호화하기";
        var result = document.getElementById("result").innerHTML;
        console.log("result : "+result);
        if(result != null)
        {
            document.getElementById("str").value = result;
            document.getElementById("result").innerHTML = "";
        }
        lang_status = 2;
    }
}

// 암호화, 복호화 하기 /////////////////////////////////////////////////
var Board = new Array(5);
var zCheck = ""; // z 확인
var ACheck = ""; // 대문자 확인
var bCheck = ""; // 공백 확인
for(var i=0; i<5; i++)
    Board[i] = new Array(5);
var enc;

function BtnClicked() {
    var key = document.getElementById("key").value;
    var str = document.getElementById("str").value;

    var blankCheck = "";
    key = key.toLowerCase();

    setBoard(key);

    
    console.log("check");
    console.log(zCheck);
    console.log(ACheck);
    console.log(bCheck);

    if(lang_status == 1) {
        for(var i=0; i<str.length; i++)
        {
            var check = str.charAt(i);
            
            // 1. 공백 제거하기
            if(check==' '){
                str = str.substring(0, i) + str.substring(i+1, str.length);
                bCheck += 1;
                i--;
                continue;
            } else bCheck += 0;

            // 2. z를 q로 바꾸기(+ 자리체크)
            if(check=='z' || check=='Z'){
                str = str.substring(0, i)+'q'+str.substring(i+1, str.length);
                zCheck += 1;
            } else zCheck += 0;

            // 3. 대문자를 소문자로 바꾸기(+ 자리체크)
            if(check.match(/^[A-Z]$/)!=null)
            {
                var A = check.toLowerCase();
                console.log(check + " "+A);
                str = str.substring(0, i)+A+str.substring(i+1, str.length);
                ACheck += 1;
            } else ACheck += 0;
        }

        enc = Encription(key, str);
        document.getElementById("result").innerHTML = enc;
    }
    else if(lang_status == 2){
        var dec = Decription(key, enc);
        document.getElementById("result").innerHTML = dec;
    }
} // BtnClicked

function setBoard(key) {
    var keyForSet = "";// 최종 결과물
    var duplicate = false; // 중복 체크
    var count = 0;

    key += "abcdefghijklmnopqrstuvwxyz";
    
    // 중복 처리하기
    for(var i=0; i<key.length; i++){
        for(var j=0; j<keyForSet.length; j++)
            if(key.charAt(i)==keyForSet.charAt(j))
            {
                duplicate = true;
                break;
            }
        if(!(duplicate)) keyForSet += key.charAt(i);
        duplicate = false;
    }

    // 배열에 대입하기
    for(var i=0; i<Board.length; i++)
        for(var j=0; j<Board[i].length; j++)
            Board[i][j] = keyForSet.charAt(count++);
        
    // 배열 출력
    var test = "";

    for(var i=0; i<Board.length; i++)
    {
        for(var j=0; j<Board[i].length; j++)
            test += Board[i][j];
        console.log(test);
        test = "";
    }
}

/*1. 태그에서 내용 받아오기
내용 출력하기 */
function Encription(key, str) {
    var before = new Array(); // 암호화 하기 전
    var after = new Array(); // 암호화 후
    var x1, x2, y1, y2;

    for(var i=0; i<str.length; i+=2)
    {
        // 글자가 반복하는가?
        if(str.charAt(i) == str.charAt(i+1)){
            before.push(str.charAt(i)+'x');
            i--;
        }
        else if(str.charAt(i+1)==''){
            before.push(str.charAt(i)+'x');
        } else before.push(str.charAt(i)+str.charAt(i+1));
    }

    for(var i=0; i<before.length; i++){
        for(var j=0; j<Board.length; j++)
            for(var k=0; k<Board[j].length; k++)
            {
                if(Board[j][k] == before[i].charAt(0))
                {
                    x1 = j;
                    y1 = k;
                }
                if(Board[j][k] == before[i].charAt(1))
                {
                    x2 = j;
                    y2 = k;
                }
            }
        
        var insert = "";
        if(x1 == x2) // 행이 같은 경우
        {
            insert += Board[x1][(y1+1)%5];
            insert += Board[x2][(y2+1)%5];
            after.push(insert);
        } 
        else if(y1 == y2) // 열이 같은 경우
        {
            insert += Board[(x1+1)%5][y1];
            insert += Board[(x2+1)%5][y2];
            after.push(insert);
        }
        else // 행, 열 모두 다른 경우
        {
            insert += Board[x2][y1];
            insert += Board[x1][y2];
            after.push(insert);
        }
    }
    var result = "";
    for(var i=0; i<after.length; i++)
    {
        result += after[i];
    }
    return result;
}// Encription

function Decription(key, str) {
    var before = new Array();
    var after = new Array();
    var x1, x2, y1, y2;
    var insert = "";
    var result = "";

    for(var i=0; i<str.length; i+=2)
    {
        before.push(str.charAt(i)+str.charAt(i+1));
    }
    
    for(var i=0; i<before.length; i++)
    {
        for(var j=0; j<Board.length; j++)
            for(var k=0; k<Board[j].length; k++)
            {
                if(Board[j][k] == before[i].charAt(0))
                {
                    x1 = j;
                    y1 = k;
                }
                if(Board[j][k] == before[i].charAt(1))
                {
                    x2 = j;
                    y2 = k;
                }
            }
        
        insert = "";
        if(x1 == x2) // 행이 같은 경우
        {
            insert += Board[x1][(y1+4)%5];
            insert += Board[x2][(y2+4)%5];
            after.push(insert);
        } 
        else if(y1 == y2) // 열이 같은 경우
        {
            insert += Board[(x1+4)%5][y1];
            insert += Board[(x2+4)%5][y2];
            after.push(insert);
        }
        else // 행, 열 모두 다른 경우
        {
            insert += Board[x2][y1];
            insert += Board[x1][y2];
            after.push(insert);
        }
    }

    var a = "";
    for(var i=0; i<after.length; i++)
    {   
        // 1. 중복문자열 돌려놓기
        if(i!=after.length-1 && after[i].charAt(1)=='x'
            && after[i].charAt(0) == after[i+1].charAt(0))
            a += after[i].charAt(0);
        else a += after[i].charAt(0)+""+after[i].charAt(1);
    }
    
    // 마지막 x를 제거하기 위해서 ; zCheck의 길이가 입력받은 길이와 같아서 사용
    for(var i=0; i<zCheck.length; i++)
    {
        result += a.charAt(i);
    }

    // 반복문을 따로 하는 이유 ; 공백을 추가하게 되면 기존의 길이가 변경되어
    // 문자열 안에 있는 내용이 잘못된 위치로 가기 떄문
    for(var i=0; i<zCheck.length; i++)
    {
        // 2. z 위치 찾기
        if(zCheck.charAt(i)=='1')
        result = result.substring(0,i)+'z'+result.substring(i+1, result.length);
        // 3. 대문자 위치 찾기
        if(ACheck.charAt(i)=='1')
        {
        var a = result.charAt(i).toUpperCase();
        result = result.substring(0,i)+a+result.substring(i+1, result.length);
        }
    }
    
    // 4. 공백 위치 찾기
    for(var i=0; i<zCheck.length; i++)
    {
        if(bCheck.charAt(i)=='1')
        result = result.substring(0,i)+' '+result.substring(i, result.length);
    }

    return result;
} // Decription

function reset() {
    Board = new Array(5);
    zCheck = ""; // z 확인
    ACheck = ""; // 대문자 확인
    bCheck = "";
    for(var i=0; i<5; i++)
        Board[i] = new Array(5);

    console.log(document.getElementById("key").value);
    document.getElementById("key").value = "";
    document.getElementById("str").value = "";
    document.getElementById("result").innerHTML = "";

    selectLang('Dec1', 2);
}