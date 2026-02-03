import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { ClientService } from "./client.service";
import { catchAsync } from "../../utils/catchAsync";

// Create client
const createClient = catchAsync(async (req, res) => {
  const file = req.file;

  if (!file) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Client logo is required",
      data: null,
    });
  }

  const result = await ClientService.createClientIntoDB(req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Client created successfully",
    data: result,
  });
});

// Get active clients (public)
const getActiveClients = catchAsync(async (req, res) => {
  const result = await ClientService.getActiveClientsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Active clients retrieved successfully",
    data: result,
  });
});

// Get all clients (admin)
const getAllClients = catchAsync(async (req, res) => {
  const result = await ClientService.getAllClientsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All clients retrieved successfully",
    data: result,
  });
});

// Get single client
const getSingleClient = catchAsync(async (req, res) => {
  const result = await ClientService.getSingleClientFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client retrieved successfully",
    data: result,
  });
});

// Update client
const updateClient = catchAsync(async (req, res) => {
  const file = req.file;
  const result = await ClientService.updateClientIntoDB(
    req.params.id,
    req.body,
    file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client updated successfully",
    data: result,
  });
});

// Delete client
const deleteClient = catchAsync(async (req, res) => {
  const result = await ClientService.deleteClientFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client deleted successfully",
    data: result,
  });
});

// Toggle client status
const toggleClientStatus = catchAsync(async (req, res) => {
  const result = await ClientService.toggleClientStatus(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client status toggled successfully",
    data: result,
  });
});

export const ClientController = {
  createClient,
  getActiveClients,
  getAllClients,
  getSingleClient,
  updateClient,
  deleteClient,
  toggleClientStatus,
};
