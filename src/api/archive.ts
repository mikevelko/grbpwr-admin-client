import { adminService } from "./admin";
import { AddArchiveRequest, AddArchiveResponse } from "./proto-http/admin";

export function addArchive(request: AddArchiveRequest): Promise<AddArchiveResponse> {
    return adminService.AddArchive(request)
}