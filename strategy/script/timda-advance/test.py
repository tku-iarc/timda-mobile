import matplotlib.pyplot as plt
import numpy as np
import math
import itertools


rt = np.zeros(6)
obj = [[0, 0], [-4, 6], [-1, 9], [3, 1]]


def main():
    # plt.plot([1, 2, 3, 4])
    # plt.show()
    a = np.array([[0], [1]])
    chromosome = np.empty([3, 2])
    chchcc = np.random.random((3, 2))
    i = 0
    # for i in range(1, 3):
    #     for j in range(1, 3):
    #         print(i, j)
    # for k in range(4):
    # #     print(k)
    # for j in range(1, 4):
    #     route = distance((obj[j][0]-obj[0][0]), (obj[j][1]-obj[0][1]))
    #     print("j is:", j)
    #     for l in range(1, 4):
    #         if l == j:
    #             continue
    #         print("l is:", l)
    #         route = route + \
    #             distance((obj[l][0]-obj[j][0]), (obj[l][1]-obj[j][1]))
    #         for a in range(1, 4):
    #             if a == l or a == j:
    #                 continue
    #             print("a is:", a)
    #             print(j, l, a, "\n")
    #             route = route + \
    #                 distance((obj[l][0]-obj[j][0]),
    #                          (obj[l][1]-obj[j][1]))
    #             route = route + \
    #                 distance((obj[0][0]-obj[l][0]),
    #                          (obj[0][1]-obj[l][1]))
    #             rt[i] = route
    #             i += 1
    # print(rt)
    # print(distance(3, 4))

    # dict = {}
    # dict['test1'] = 1
    # dict['test2'] = 2
    # dict['test3'] = 3
    # print(dict(1))
    # cal = [1, 2, 3]
    # dic = {'test1': 123, 'test2': 234, 'test3': 345}
    # dic_2 = [123, 234, 345]
    # cal_2 = list(itertools.permutations(cal, len(cal)))

    # for i in cal_2:
    #     for j in i:
    #         print(j)
    # # for i in dict:
    # #     print(dict[i])
    list = [1, 2, 3, 4]

    arr = [1, 2, 3]
    str1 = ','.join(str(i) for i in arr)
    print(len(list))


def distance(x, y):
    r = math.sqrt(pow(x, 2) + pow(y, 2))
    return r


main()
