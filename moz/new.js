var saveTasks=[];
var totalTaskCount=0;
$(document).ready(function(){
    // $(".drag-container").draggable({
    //     start: handleDragStart,
    //     cursor: 'move',
    //     revert: "invalid",
    // });
    // $(".drop-container").droppable({
    //     drop: handleDropEvent,
    //     tolerance: "touch",              
    // });
    saveTasks=JSON.parse(localStorage.getItem("saved_tasks"));
    if(!saveTasks){
        saveTasks=[];
    }else{
        totalTaskCount=parseInt(localStorage.getItem("totalTaskCount"));
        var todoCount=0,inProgessCount=0,doneCount=0;
        for(let i=0;i<saveTasks.length;i++){
            var prependTask=`<div class="drag-container" data-position-stack="${saveTasks[i].position_stack}" 
                    id="${saveTasks[i].id}">
                    <div class="delete-list">
                        <span class="task-count">${saveTasks[i].task_count}</span>
                        <span class="delete-action">X</span>
                    </div>
                    <div class="task-text">${saveTasks[i].task_text}</div>
                </div>`;
            $(".drop-body",$(`#${saveTasks[i].position_stack}`)).prepend(prependTask);
            $(`#${saveTasks[i].id}`).draggable({
                start: handleDragStart,
                cursor: 'move',
                revert: "invalid",
            });
            if(saveTasks[i].position_stack=="to-do"){
                todoCount=todoCount+1;
            }
            if(saveTasks[i].position_stack=="in-progress"){
                inProgessCount=inProgessCount+1;                
            }
            if(saveTasks[i].position_stack=="done"){
                doneCount=doneCount+1;                
            }
            initDelete($(`#${saveTasks[i].id}`));             
        }
        $("#to-do .drop-header span").html(todoCount);
        $("#in-progress .drop-header span").html(inProgessCount);
        $("#done .drop-header span").html(doneCount);
    }    
    $(".drop-wrapper").droppable({
             drop: handleDropEvent,
             // hoverClass: "ui-state-active",
            // tolerance: "touch",   
            cursor: 'move',
            revert: "invalid",
            over: function(ui) {
                $(".drop-wrapper").removeClass(`hover-to-do hover-in-progress hover-done`);
                $(ui.target).addClass(`hover-${ui.target.id}`);
            }
         
    });
    $("#add-task-btn").on("click",function(){
        var taskText=$('#list-area').val().trim();
        if(!taskText){
            return false;
        }
        var dragContainerCounter=$(".drag-container").length;
        var task_count=dragContainerCounter+1;
        if(!totalTaskCount){
            totalTaskCount=totalTaskCount+parseInt(task_count);
        }else{
            totalTaskCount=totalTaskCount+1;
            localStorage.setItem("totalTaskCount",totalTaskCount);
        }
        var prependTask=`<div class="drag-container" data-position-stack="to-do" 
                            id="drag-${totalTaskCount}">
                            <div class="delete-list">
                                <span class="task-count">${totalTaskCount}</span>
                                <span class="delete-action">X</span>
                            </div>
                            <div class="task-text">${taskText}</div>
                        </div>`;
        saveTasks.push({
            "id":`drag-${totalTaskCount}`,
            "position_stack":"to-do",
            "task_count":`${totalTaskCount}`,
            "task_text":`${taskText}`
        });
        localStorage.setItem("saved_tasks",JSON.stringify(saveTasks));
        var $toDoCounterElement=$(".drop-header span",$("#to-do"));
        var toDoCounter=parseInt($toDoCounterElement.html());
        $("#to-do .drop-body").prepend(prependTask);
        $toDoCounterElement.html(toDoCounter+1);
        $('#todo-modal').modal('toggle');
        $(`#drag-${totalTaskCount}`).draggable({
            start: handleDragStart,
            cursor: 'move',
            revert: "invalid",
        });   
        initDelete($(`#drag-${totalTaskCount}`));
        $("#list-area").val(null);
        // $(`#drag-${dragContainerCounter}`).addClass("inherit-width")        
    });
});

function handleDragStart (event, ui) { 
    
}

function handleDropEvent (event, ui) {
    // debugger;

    var $draggedElement=ui.draggable,
        $thisElement=$(this),
        $newDroppedElement=$($thisElement.closest(".ui-droppable")).closest(".drop-wrapper"),
        oldPositionedStack=$draggedElement.attr("data-position-stack"),
        $oldDroppedElement=$("#"+oldPositionedStack),
        newDropedElementId=$newDroppedElement.attr("id");        
        $newDropedHeaderSpan=$(`.drop-header span`,$newDroppedElement),
        $oldDropedHeaderSpan=$(`.drop-header span`,$oldDroppedElement);
        $draggedElement.attr("data-position-stack",newDropedElementId);

        $newDropedHeaderSpan.html(parseInt($newDropedHeaderSpan.html().trim())+1);
        $oldDropedHeaderSpan.html(parseInt($oldDropedHeaderSpan.html().trim())-1);        
        
        var elementId=$draggedElement.attr("id"),
            taskCount=parseInt($(".task-count",$draggedElement).html()),
            task_text=$(".task-text",$draggedElement).text().trim();  
        var prependTask=`<div class="drag-container" data-position-stack="${newDropedElementId}" 
                            id="${elementId}">
                            <div class="delete-list">
                                <span class="task-count">${taskCount}</span>
                                <span class="delete-action">X</span>
                            </div>
                            <div class="task-text">
                                ${task_text}
                            </div>
                        </div>`;      
        //removing the older status/stack entry  
        saveTasks = saveTasks.filter(function( obj ) {
          return obj.id !== elementId;
        });
        //pushing the new status/stack entry
        saveTasks.push({
            "id":`${elementId}`,
            "position_stack":`${newDropedElementId}`,
            "task_count":`${taskCount}`,
            "task_text":`${task_text}`
        });                        
        localStorage.setItem("saved_tasks",JSON.stringify(saveTasks));
        $draggedElement.remove();
        $(".drop-body",$newDroppedElement).prepend(prependTask);
        $(`#${elementId}`).draggable({
            start: handleDragStart,
            cursor: 'move',
            revert: "invalid",
        });
        $(`#${elementId}`).addClass("flash-div");
        setTimeout(function(){
            $(`#${elementId}`).removeClass("flash-div");
        },500)
        $(".drop-wrapper").removeClass(`hover-to-do hover-in-progress hover-done`);        
        initDelete($(`#${elementId}`));        
}

function initDelete(deleteElement){
    $(".delete-list span.delete-action",$(deleteElement)).off().on("click",function(){
        let $newDroppedElement=$(this).closest(".drop-wrapper"),
            $newDropedHeaderSpan=$(`.drop-header span`,$newDroppedElement),
            draggedElementId=$(this).closest(".drag-container").attr("id");
        $newDropedHeaderSpan.html(parseInt($newDropedHeaderSpan.html().trim())-1);
        $(this).closest(".drag-container").remove();
        saveTasks = saveTasks.filter(function( obj ) {
          return obj.id != draggedElementId;
        });        
        localStorage.setItem("saved_tasks",JSON.stringify(saveTasks));
    });
}