import { adminService } from "./admin";
import { AddArchiveRequest, AddArchiveResponse, GetArchivesPagedRequest, GetArchivesPagedResponse, AddArchiveItemsRequest, AddArchiveItemsResponse, DeleteArchiveByIdRequest, DeleteArchiveByIdResponse } from "./proto-http/admin";

export function addArchive(request: AddArchiveRequest): Promise<AddArchiveResponse> {
    return adminService.AddArchive(request)
}

export function getArchive(request: GetArchivesPagedRequest): Promise<GetArchivesPagedResponse> {
    return adminService.GetArchivesPaged(request)
}


export function addArchiveItem(request: AddArchiveItemsRequest): Promise<AddArchiveItemsResponse> {
    return adminService.AddArchiveItems(request)
}

export function deleteArchive(request: DeleteArchiveByIdRequest): Promise<DeleteArchiveByIdResponse> {
    return adminService.DeleteArchiveById(request)
}
