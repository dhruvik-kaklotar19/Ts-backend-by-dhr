import { Request, Response } from 'express';
import { escapeRegex, sendApiResponse, STATUS_CODES, responseMessage, LOG } from '../common';

export const crudService = {
  create: async (req: Request, res: Response, Model: any, label: string) => {
    try {
      const body = req.body;
      const doc = new Model(body);
      await doc.save();

      return sendApiResponse(res, STATUS_CODES.CREATED, responseMessage.addDataSuccess(label), doc);
    } catch (error: any) {
      LOG.error(error);
      return sendApiResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, responseMessage.addDataError, {}, { error: error.message });
    }
  },

  getAll: async (req: Request, res: Response, Model: any, label: string, populateFields: string[] = []) => {
    try {
      req.body.isActive = true;
      const query = Model.find(req.body).sort({ createdAt: -1 });
      populateFields.forEach(field => query.populate(field));
      query.lean();
      const data = await query;

      return sendApiResponse(res, STATUS_CODES.OK, responseMessage.getDataSuccess(label), data);
    } catch (error: any) {
      LOG.error(error);
      return sendApiResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, responseMessage.addDataError, {}, { error: error.message });
    }
  },

  getById: async (req: Request, res: Response, Model: any, label: string, populateFields: string[] = []) => {
    try {
      const { id } = req.params;
      const query = Model.findById(id);
      populateFields.forEach(field => query.populate(field));
      const data = await query;

      if (!data) {
        return sendApiResponse(res, STATUS_CODES.NOT_FOUND, responseMessage.getDataNotFound(label), {});
      }

      return sendApiResponse(res, STATUS_CODES.OK, responseMessage.getDataSuccess(label), data);
    } catch (error: any) {
      LOG.error(error);
      return sendApiResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, responseMessage.addDataError, {}, { error: error.message });
    }
  },

  getWithPagination: async (
    req: Request,
    res: Response,
    Model: any,
    label: string,
    searchableFields: string[] = ['name'],
    lookUp: any = null
  ) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.body;
      delete req.body.page;
      delete req.body.limit;
      delete req.body.search;

      const match: any = { ...req.body, isActive: true };

      if (search && searchableFields.length > 0) {
        const escapedSearch = escapeRegex(search);
        match.$or = searchableFields.map(field => ({
          [field]: { $regex: escapedSearch, $options: 'i' }
        }));
      }

      const pipeline: any[] = [{ $match: match }];

      if (lookUp && Object.keys(lookUp).length > 0) {
        pipeline.push(lookUp);
      }

      pipeline.push({
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: (Number(page) - 1) * Number(limit) },
            { $limit: Number(limit) }
          ],
          data_count: [{ $count: 'count' }]
        }
      });

      const response = await Model.aggregate(pipeline);
      const totalCount = response[0]?.data_count[0]?.count || 0;

      return sendApiResponse(res, STATUS_CODES.OK, responseMessage.getDataSuccess(label), {
        [`${label}_data`]: response[0].data,
        state: {
          page: Number(page),
          limit: Number(limit),
          page_limit: Math.ceil(totalCount / Number(limit)) || 1,
          total: totalCount,
        }
      });
    } catch (error: any) {
      LOG.error(error);
      return sendApiResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, { error: error.message });
    }
  },

  update: async (req: Request, res: Response, Model: any, label: string) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updated = await Model.findByIdAndUpdate(id, body, { new: true });

      if (!updated) {
        return sendApiResponse(res, STATUS_CODES.NOT_FOUND, responseMessage.getDataNotFound(label), {});
      }

      return sendApiResponse(res, STATUS_CODES.OK, responseMessage.updateDataSuccess(label), updated);
    } catch (error: any) {
      LOG.error(error);
      return sendApiResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, responseMessage.updateDataError(label), {}, { error: error.message });
    }
  },

  delete: async (req: Request, res: Response, Model: any, label: string, isSoft: boolean = true) => {
    try {
      const { id } = req.params;

      if (isSoft) {
        await Model.findByIdAndUpdate(id, { isActive: false }, { new: true });
        return sendApiResponse(res, STATUS_CODES.OK, responseMessage.deleteDataSuccess(label), {});
      }

      const deleted = await Model.findByIdAndDelete(id);

      if (!deleted) {
        return sendApiResponse(res, STATUS_CODES.NOT_FOUND, responseMessage.deleteDataNotSuccess(label), {});
      }

      return sendApiResponse(res, STATUS_CODES.OK, responseMessage.deleteDataSuccess(label), {});
    } catch (error: any) {
      LOG.error(error);
      return sendApiResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, responseMessage.deleteDataNotSuccess(label), {}, { error: error.message });
    }
  }
};
