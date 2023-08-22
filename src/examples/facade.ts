import { Injectable } from "@angular/core";
import { ResponseEnum } from "src/app/base-enums/response-enum";
import { ResponseModel } from "src/app/base-models/base/ResponseModel";
import { DataAccessService } from "src/app/core/base-data-access/data-access.service";
import { NotificationService } from "src/app/shared/notification/notification.service";
import { TodoState } from "./state/todo.state";

@Injectable()
export class TodoFacade { 

    constructor(
        private apiService: DataAccessService,
        private todoState: TodoState,
        private notificationService: NotificationService
    ) { }

    async getTodoData() {
        this.todoState.isLoadingContent = true;
        this.todoState.isEmptyContent = false;
  
        const resData: ResponseModel = await this.apiService.get('/todo');
  
        if(resData.responseEnum === ResponseEnum.SUCCESS){
          this.todoState.homeContent = resData.data.data;
        } else{
          this.notificationService.error(resData.responseMsg);
          this.todoState.isEmptyContent = true;
        }
  
        this.todoState.isLoadingContent = false;
    }

    getObservableHome(){
        return this.todoState.homeData$;
    }
  
    getObservableIsLoading(){
        return this.todoState.isLoading$;
    }
  
    getObservableIsEmpty(){
        return this.todoState.isEmptyList$;
    }

}