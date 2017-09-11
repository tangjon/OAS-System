var data = (function(){
    var memberList;

    // Subscribe to changes on memberlist
    events.on('updatedMembers', updateMemberList);

    // Fetch member objects
    function updateMemberList(value){
        memberList = value;
    }

    function getMemberList(){
        return memberList;
    }
    
    return {
        getMemberList : getMemberList
    }

})();


var oasTable = (function () {

    // Cache dom
    var tbl = $("#my-badge-table");
    var section;
 

     // Subscribe to changes on memberlist
    events.on('updatedMembers', render)

    function buildHeader(){
        var tblHeaders = [];
        db.ref('meta/headers').once("value", function (snapshot) {
            var snap = snapshot.val();
            for (var key in snap) {
                tblHeaders.push(snap[key]);
            }
        });
        // TODO : Currently only reading from scout badges...
        db.ref('badge_info/scout_badges').once("value", function (snapshot) {
            var snap = snapshot.val();
            for (var key in snap) {
                tblHeaders.push(snap[key].name);
            }
        });
        console.log(tblHeaders);
        return tblHeaders;
    }

    function buildSpinner(member){
         // GENERATE DROP DOWNS
         var select = document.createElement("SELECT");
         select.setAttribute("class", "mdl-selectfield__select");
         select.setAttribute("id", key + ' ' + badge)
         select.setAttribute("onchange", "handleSelectBox(this);");

         // Spinner Values
         if (member.section != "beaver") {
             for (var i = 0; i <= 9; i++) {
                 var opt = document.createElement('OPTION');
                 opt.value = i;
                 opt.innerHTML = i;
                 select.appendChild(opt);
             }
         } else {
             for (var i = 0; i <= 3; i++) {
                 var opt = document.createElement('OPTION');
                 opt.value = i;
                 opt.innerHTML = i;
                 select.appendChild(opt);
             }
         }
         // Set Spinner value to current member level
         select.value = thisBadge.level;
         return select;
    }
    function createTable(){
     
        var members = data.getMemberList();

        // Generate Header
        var thead = $('<thead></thead>');
        var tblheaders = buildHeader();
        console.log(tblheaders[0]);
        tbl.append(thead);
        
        // Iterate through members
        for(var key in members){
            var currMember = members[key];
            
        }
    }
    function render() {
        createTable();
            
    }

})();