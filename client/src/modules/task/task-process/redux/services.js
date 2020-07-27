import { LOCAL_SERVER_API } from '../../../../env';
import {
    getStorage
} from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';

export const TaskProcessService = {
  exportXmlDiagram
};

// get all task template
function exportXmlDiagram(data) {
  return sendRequest({
      url: `${LOCAL_SERVER_API}/taskprocess`,
      method: 'POST',
      data: data
  }, false, true, 'task.task_template');
}